import express from "express";
import {
  createNode,
  getNodes,
  updateNode,
  deleteNode,
} from "../controllers/nodeController.js";

const router = express.Router();

router.get("/workflows/:workflowId/nodes", getNodes);
router.post("/workflows/:workflowId/nodes", createNode);
router.put("/nodes/:nodeId", updateNode);
router.delete("/nodes/:nodeId", deleteNode);

export default router;