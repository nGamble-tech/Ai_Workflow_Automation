import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { runWorkflowHandler } from "../controllers/executionController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/workflows/:id/run", runWorkflowHandler);

export default router;