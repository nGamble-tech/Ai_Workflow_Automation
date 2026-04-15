import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import nodeRoutes from "./routes/nodeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "OK",
      message: "Server running",
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
    });
  }
});

app.use("/api/workflows", workflowRoutes);
app.use("/api", nodeRoutes);

export default app;