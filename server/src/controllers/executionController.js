import { runWorkflow } from "../engine/workflowEngine.js";
import {
  getExecutionsByWorkflowId,
  getExecutionSteps,
} from "../models/executionModel.js";
import { getWorkflowById } from "../models/workflowModel.js";

export async function runWorkflowHandler(req, res) {
  try {
    const { id } = req.params;

    const result = await runWorkflow({
      workflowId: id,
      userId: req.user.id,
      triggerData: req.body ?? {},
    });

    if (result.error) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Run workflow error:", error);
    res.status(500).json({
      message: "Failed to run workflow",
      error: error.message,
    });
  }
}

export async function getWorkflowExecutions(req, res) {
  try {
    const { workflowId } = req.params;

    const workflow = await getWorkflowById(workflowId, req.user.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const executions = await getExecutionsByWorkflowId(workflowId);

    res.json(executions);
  } catch (error) {
    console.error("Get workflow executions error:", error);
    res.status(500).json({
      message: "Failed to fetch executions",
      error: error.message,
    });
  }
}

export async function getExecutionStepsHandler(req, res) {
  try {
    const { executionId } = req.params;

    const steps = await getExecutionSteps(executionId);

    res.json(steps);
  } catch (error) {
    console.error("Get execution steps error:", error);
    res.status(500).json({
      message: "Failed to fetch execution steps",
      error: error.message,
    });
  }
}