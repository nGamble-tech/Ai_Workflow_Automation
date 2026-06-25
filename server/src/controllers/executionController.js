import { runWorkflow } from "../engine/workflowEngine.js";

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