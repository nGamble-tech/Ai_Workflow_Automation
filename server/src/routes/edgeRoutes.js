// Route connection for edges

import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createEdge,
  getEdges,
  deleteEdge,
} from "../controllers/edgeController.js";

const router = express.Router();
router.use(requireAuth);

router.get("/workflows/:workflowId/edges", getEdges);
router.post("/workflows/:workflowId/edges", createEdge);
router.delete("/edges/:edgeId", deleteEdge);

export default router;