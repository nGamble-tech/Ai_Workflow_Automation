// CRUD logic to making, displaying, updating and deleting workflows and graphs

import {
  createWorkflow,
  getAllWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} from "../models/workflowModel.js";
import { getNodesByWorkflowId } from "../models/nodeModel.js";
import { getEdgesByWorkflowId } from "../models/edgeModel.js";

// temporary hardcoded user id for development
const TEST_USER_ID = "53d2cf8c-5684-4e6d-9dab-b4243f186caa";

export async function createWorkflowHandler(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Workflow name is required" });
    }

    const workflow = await createWorkflow({
      userId: TEST_USER_ID,
      name: name.trim(),
      description: description?.trim() || null,
    });

    res.status(201).json(workflow);
  } catch (error) {
    console.error("Create workflow error:", error.message);
    res.status(500).json({ message: "Failed to create workflow" });
  }
}

export async function getAllWorkflowsHandler(req, res) {
  try {
    const workflows = await getAllWorkflows(TEST_USER_ID);
    res.json(workflows);
  } catch (error) {
    console.error("Get workflows error:", error.message);
    res.status(500).json({ message: "Failed to fetch workflows" });
  }
}

export async function getWorkflowByIdHandler(req, res) {
  try {
    const { id } = req.params;

    const workflow = await getWorkflowById(id, TEST_USER_ID);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json(workflow);
  } catch (error) {
    console.error("Get workflow error:", error.message);
    res.status(500).json({ message: "Failed to fetch workflow" });
  }
}

export async function updateWorkflowHandler(req, res) {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Workflow name is required" });
    }

    const updatedWorkflow = await updateWorkflow(id, TEST_USER_ID, {
      name: name.trim(),
      description: description?.trim() || null,
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    if (!updatedWorkflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json(updatedWorkflow);
  } catch (error) {
    console.error("Update workflow error:", error.message);
    res.status(500).json({ message: "Failed to update workflow" });
  }
}

export async function deleteWorkflowHandler(req, res) {
  try {
    const { id } = req.params;

    const deletedWorkflow = await deleteWorkflow(id, TEST_USER_ID);

    if (!deletedWorkflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json({ message: "Workflow deleted", workflow: deletedWorkflow });
  } catch (error) {
    console.error("Delete workflow error:", error.message);
    res.status(500).json({ message: "Failed to delete workflow" });
  }
}

//Full workflow framework call
export async function getWorkflowGraph(req, res) {
  try {
    const { id } = req.params;

    const workflow = await getWorkflowById(id, TEST_USER_ID);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const nodes = await getNodesByWorkflowId(id);
    const edges = await getEdgesByWorkflowId(id);

    res.json({
      workflow,
      nodes,
      edges,
    });
  } catch (error) {
    console.error("Get workflow graph error:", error);
    res.status(500).json({
      message: "Failed to fetch workflow graph",
      error: error.message,
    });
  }
}