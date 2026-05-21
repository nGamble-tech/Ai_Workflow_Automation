import { getWorkflowById } from "../models/workflowModel.js";
import { getNodesByWorkflowId } from "../models/nodeModel.js";
import { getEdgesByWorkflowId } from "../models/edgeModel.js";
import {
  createExecution,
  updateExecutionStatus,
  createExecutionStep,
} from "../models/executionModel.js";
import { executeNode } from "./nodeExecutor.js";

export async function runWorkflow({ workflowId, userId, triggerData }) {
  const workflow = await getWorkflowById(workflowId, userId);

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const nodes = await getNodesByWorkflowId(workflowId);
  const edges = await getEdgesByWorkflowId(workflowId);

  if (nodes.length === 0) {
    throw new Error("Workflow has no nodes");
  }

  const execution = await createExecution({
    workflowId,
    triggerData,
  });

  try {
    const startNode = findStartNode(nodes, edges);

    let currentNode = startNode;
    let context = {
      triggerData: triggerData ?? {},
    };

    const visited = new Set();

    while (currentNode) {
      if (visited.has(currentNode.id)) {
        throw new Error("Cycle detected in workflow");
      }

      visited.add(currentNode.id);

      const inputData = { ...context };

      try {
        const outputData = await executeNode(currentNode, context);

        await createExecutionStep({
          executionId: execution.id,
          nodeId: currentNode.id,
          status: "success",
          inputData,
          outputData,
        });

        context = {
          ...context,
          ...outputData,
        };

        currentNode = getNextNode(currentNode, nodes, edges, context);
      } catch (nodeError) {
        await createExecutionStep({
          executionId: execution.id,
          nodeId: currentNode.id,
          status: "failed",
          inputData,
          outputData: {},
          errorMessage: nodeError.message,
        });

        throw nodeError;
      }
    }

    const completedExecution = await updateExecutionStatus({
      executionId: execution.id,
      status: "success",
    });

    return {
      execution: completedExecution,
      finalContext: context,
    };
  } catch (error) {
    const failedExecution = await updateExecutionStatus({
      executionId: execution.id,
      status: "failed",
    });

    return {
      execution: failedExecution,
      error: error.message,
    };
  }
}

function findStartNode(nodes, edges) {
  const targetNodeIds = new Set(edges.map((edge) => edge.target_node_id));

  const startNode =
    nodes.find((node) => node.type === "trigger") ||
    nodes.find((node) => !targetNodeIds.has(node.id));

  if (!startNode) {
    throw new Error("No valid start node found");
  }

  return startNode;
}

function getNextNode(currentNode, nodes, edges, context) {
  const outgoingEdges = edges.filter(
    (edge) => edge.source_node_id === currentNode.id
  );

  if (outgoingEdges.length === 0) {
    return null;
  }

  // V1: follow the first outgoing edge.
  // Later, condition nodes can choose true/false branches.
  const nextEdge = outgoingEdges[0];

  return nodes.find((node) => node.id === nextEdge.target_node_id) ?? null;
}