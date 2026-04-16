import express from "express";
import {
  createEdge,
  getEdges,
  deleteEdge,
} from "../controllers/edgeController.js";

const router = express.Router();

router.get("/workflows/:workflowId/edges", getEdges);
router.post("/workflows/:workflowId/edges", createEdge);
router.delete("/edges/:edgeId", deleteEdge);

export default router;