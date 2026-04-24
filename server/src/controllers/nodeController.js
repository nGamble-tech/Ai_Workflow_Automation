//CRUD logic for nodes

import * as nodeModel from "../models/nodeModel.js";
import { getWorkflowById } from "../models/workflowModel.js";



export async function createNode(req, res) {
  try {
    const { workflowId } = req.params;
    const { type, label, config, position_x, position_y } = req.body;

    if (!type || !label) {
      return res.status(400).json({ message: "type and label are required" });
    }

    const workflow = await getWorkflowById(workflowId, req.user.id);

     console.log("CREATE NODE DEBUG:", {
      workflowId,
      type,
      label,
      config,
      position_x,
      position_y,
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const node = await nodeModel.createNode({
      workflowId,
      type,
      label,
      config,
      position_x,
      position_y,
    });

    res.status(201).json(node);
  } catch (error) {
    console.error("Create node error:", error.message);
    res.status(500).json({ message: "Failed to create node" });
  }
}

export async function getNodes(req, res) {
  try {
    const { workflowId } = req.params;

    const workflow = await getWorkflowById(workflowId, req.user.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const nodes = await nodeModel.getNodesByWorkflowId(workflowId);
    res.json(nodes);
  } catch (error) {
    console.error("Get nodes error:", error.message);
    res.status(500).json({ message: "Failed to fetch nodes" });
  }
}

export async function updateNode(req, res) {
  try {
    const { nodeId } = req.params;
    const { type, label, config, position_x, position_y } = req.body;

    if (!type || !label) {
      return res.status(400).json({ message: "type and label are required" });
    }

    const updatedNode = await nodeModel.updateNode(nodeId, {
      type,
      label,
      config,
      position_x,
      position_y,
    });

    if (!updatedNode) {
      return res.status(404).json({ message: "Node not found" });
    }

    res.json(updatedNode);
  } catch (error) {
    console.error("Update node error:", error.message);
    res.status(500).json({ message: "Failed to update node" });
  }
}

export async function deleteNode(req, res) {
  try {
    const { nodeId } = req.params;

    const deletedNode = await nodeModel.deleteNode(nodeId);

    if (!deletedNode) {
      return res.status(404).json({ message: "Node not found" });
    }

    res.json({ message: "Node deleted", node: deletedNode });
  } catch (error) {
    console.error("Delete node error:", error.message);
    res.status(500).json({ message: "Failed to delete node" });
  }
}