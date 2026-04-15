import express from "express";
import {
  createWorkflowHandler,
  getAllWorkflowsHandler,
  getWorkflowByIdHandler,
  updateWorkflowHandler,
  deleteWorkflowHandler,
} from "../controllers/workflowController.js";

const router = express.Router();

router.get("/", getAllWorkflowsHandler);
router.get("/:id", getWorkflowByIdHandler);
router.post("/", createWorkflowHandler);
router.put("/:id", updateWorkflowHandler);
router.delete("/:id", deleteWorkflowHandler);

export default router;