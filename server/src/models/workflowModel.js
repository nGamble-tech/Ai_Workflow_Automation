//Db querys of workflows

import pool from "../config/db.js";

export async function createWorkflow({ userId, name, description }) {
  const query = `
    INSERT INTO workflows (user_id, name, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, name, description];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getAllWorkflows(userId) {
  const query = `
    SELECT *
    FROM workflows
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function getWorkflowById(id, userId) {
  const query = `
    SELECT *
    FROM workflows
    WHERE id = $1 AND user_id = $2;
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rows[0];
}

export async function updateWorkflow(id, userId, { name, description, is_active }) {
  const query = `
    UPDATE workflows
    SET
      name = $1,
      description = $2,
      is_active = $3
    WHERE id = $4 AND user_id = $5
    RETURNING *;
  `;
  const values = [name, description, is_active, id, userId];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteWorkflow(id, userId) {
  const query = `
    DELETE FROM workflows
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rows[0];
}