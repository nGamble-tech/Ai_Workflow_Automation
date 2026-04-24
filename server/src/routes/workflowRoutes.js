//Route connection for workflows and graphs

import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createWorkflowHandler,
  getAllWorkflowsHandler,
  getWorkflowByIdHandler,
  updateWorkflowHandler,
  deleteWorkflowHandler,
  getWorkflowGraph,
} from "../controllers/workflowController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllWorkflowsHandler);
router.get("/:id/graph", getWorkflowGraph);
router.get("/:id", getWorkflowByIdHandler);
router.post("/", createWorkflowHandler);
router.put("/:id", updateWorkflowHandler);
router.delete("/:id", deleteWorkflowHandler);


export default router;