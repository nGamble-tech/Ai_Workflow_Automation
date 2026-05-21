import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  runWorkflowHandler,
  getWorkflowExecutions,
  getExecutionStepsHandler,
} from "../controllers/executionController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/workflows/:id/run", runWorkflowHandler);
router.get("/workflows/:workflowId/executions", getWorkflowExecutions);
router.get("/executions/:executionId/steps", getExecutionStepsHandler);

export default router;