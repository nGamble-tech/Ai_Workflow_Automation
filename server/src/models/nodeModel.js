import pool from "../config/db.js";

export async function createNode({
  workflowId,
  type,
  label,
  config,
  position_x,
  position_y,
}) {
  const result = await pool.query(
    `INSERT INTO nodes (workflow_id, type, label, config, position_x, position_y)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
     [
      workflowId,
      type,
      label,
      JSON.stringify(config ?? {}),
      position_x ?? 0,
      position_y ?? 0,
    ]
  );

  return result.rows[0];
}

export async function getNodesByWorkflowId(workflowId) {
  const result = await pool.query(
    `SELECT *
     FROM nodes
     WHERE workflow_id = $1
     ORDER BY created_at ASC`,
    [workflowId]
  );

  return result.rows;
}

export async function getNodeById(nodeId) {
  const result = await pool.query(
    `SELECT *
     FROM nodes
     WHERE id = $1`,
    [nodeId]
  );

  return result.rows[0];
}

export async function updateNode(nodeId, { type, label, config, position_x, position_y }) {
  const result = await pool.query(
    `UPDATE nodes
     SET type = $1,
         label = $2,
         config = $3,
         position_x = $4,
         position_y = $5
     WHERE id = $6
     RETURNING *`,
    [type, label, config || {}, position_x ?? 0, position_y ?? 0, nodeId]
  );

  return result.rows[0];
}

export async function deleteNode(nodeId) {
  const result = await pool.query(
    `DELETE FROM nodes
     WHERE id = $1
     RETURNING *`,
    [nodeId]
  );

  return result.rows[0];
}