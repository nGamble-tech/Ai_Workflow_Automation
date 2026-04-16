import pool from "../config/db.js";

export async function createEdge({
  workflowId,
  source_node_id,
  target_node_id,
}) {
  const result = await pool.query(
    `INSERT INTO edges (workflow_id, source_node_id, target_node_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [workflowId, source_node_id, target_node_id]
  );

  return result.rows[0];
}

export async function getEdgesByWorkflowId(workflowId) {
  const result = await pool.query(
    `SELECT *
     FROM edges
     WHERE workflow_id = $1
     ORDER BY created_at ASC`,
    [workflowId]
  );

  return result.rows;
}

export async function getEdgeById(edgeId) {
  const result = await pool.query(
    `SELECT *
     FROM edges
     WHERE id = $1`,
    [edgeId]
  );

  return result.rows[0];
}

export async function deleteEdge(edgeId) {
  const result = await pool.query(
    `DELETE FROM edges
     WHERE id = $1
     RETURNING *`,
    [edgeId]
  );

  return result.rows[0];
}