import pool from "../config/db.js";

export async function createExecution({ workflowId, triggerData }) {
  const result = await pool.query(
    `INSERT INTO executions (workflow_id, status, trigger_data)
     VALUES ($1, $2, $3::jsonb)
     RETURNING *`,
    [workflowId, "running", JSON.stringify(triggerData ?? {})]
  );

  return result.rows[0];
}

export async function updateExecutionStatus({ executionId, status }) {
  const result = await pool.query(
    `UPDATE executions
     SET status = $1,
         finished_at = CASE WHEN $1 IN ('success', 'failed') THEN CURRENT_TIMESTAMP ELSE finished_at END
     WHERE id = $2
     RETURNING *`,
    [status, executionId]
  );

  return result.rows[0];
}

export async function createExecutionStep({
  executionId,
  nodeId,
  status,
  inputData,
  outputData,
  errorMessage,
}) {
  const result = await pool.query(
    `INSERT INTO execution_steps
      (execution_id, node_id, status, input_data, output_data, error_message)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6)
     RETURNING *`,
    [
      executionId,
      nodeId,
      status,
      JSON.stringify(inputData ?? {}),
      JSON.stringify(outputData ?? {}),
      errorMessage ?? null,
    ]
  );

  return result.rows[0];
}

export async function getExecutionsByWorkflowId(workflowId) {
  const result = await pool.query(
    `SELECT *
     FROM executions
     WHERE workflow_id = $1
     ORDER BY started_at DESC`,
    [workflowId]
  );

  return result.rows;
}

export async function getExecutionSteps(executionId) {
  const result = await pool.query(
    `SELECT *
     FROM execution_steps
     WHERE execution_id = $1
     ORDER BY executed_at ASC`,
    [executionId]
  );

  return result.rows;
}