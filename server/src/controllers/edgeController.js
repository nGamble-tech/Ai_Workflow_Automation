// CRUD logic for edges

import * as edgeModel from "../models/edgeModel.js";
import { getWorkflowById } from "../models/workflowModel.js";
import { getNodeById } from "../models/nodeModel.js";



export async function createEdge(req, res) {
  try {
    const { workflowId } = req.params;
    const { source_node_id, target_node_id } = req.body;

    if (!source_node_id || !target_node_id) {
      return res.status(400).json({
        message: "source node id and target node id are required",
      });
    }

    if (source_node_id === target_node_id) {
      return res.status(400).json({
        message: "A node cannot connect to itself",
      });
    }

    const workflow = await getWorkflowById(workflowId, req.user.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const sourceNode = await getNodeById(source_node_id);
    const targetNode = await getNodeById(target_node_id);

    if (!sourceNode || !targetNode) {
      return res.status(404).json({ message: "Source or target node not found" });
    }

    if (
      sourceNode.workflow_id !== workflowId ||
      targetNode.workflow_id !== workflowId
    ) {
      return res.status(400).json({
        message: "Both nodes must belong to the specified workflow",
      });
    }

    const edge = await edgeModel.createEdge({
      workflowId,
      source_node_id,
      target_node_id,
    });

    res.status(201).json(edge);
  } catch (error) {
    console.error("Create edge error:", error);
    res.status(500).json({
      message: "Failed to create edge",
      error: error.message,
    });
  }
}

export async function getEdges(req, res) {
  try {
    const { workflowId } = req.params;

    const workflow = await getWorkflowById(workflowId, req.user.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const edges = await edgeModel.getEdgesByWorkflowId(workflowId);
    res.json(edges);
  } catch (error) {
    console.error("Get edges error:", error);
    res.status(500).json({
      message: "Failed to fetch edges",
      error: error.message,
    });
  }
}

export async function deleteEdge(req, res) {
  try {
    const { edgeId } = req.params;

    const deletedEdge = await edgeModel.deleteEdge(edgeId);

    if (!deletedEdge) {
      return res.status(404).json({ message: "Edge not found" });
    }

    res.json({ message: "Edge deleted", edge: deletedEdge });
  } catch (error) {
    console.error("Delete edge error:", error);
    res.status(500).json({
      message: "Failed to delete edge",
      error: error.message,
    });
  }
}