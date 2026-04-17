# API Route Testing Guide

This document explains how to test all backend API routes currently implemented for the AI Workflow Automation project.

## Base URL

```text
http://localhost:3232
```

Make sure the backend server is running before testing:

```bash
cd server
npm run dev
```

---

## Recommended Tools

You can test the API using any of these tools:

- Postman
- Thunder Client
- Insomnia

I reccommend Postman as it's the easiest and most intuative in my opinion.

---

## Before You Start

A few routes depend on records that already exist in the database.

You should have:

- one test user in the `users` table
- at least one workflow
- at least one or two nodes attached to that workflow
- optionally one edge connecting two nodes

Because the current backend still uses a temporary hardcoded `TEST_USER_ID` in controllers, the workflow, node, and edge records must belong to that same test user.

---

## Route Testing Order

The best order for testing is:

1. health route
2. workflow routes
3. node routes
4. edge routes

This avoids testing child resources before parent resources exist.

---

# 1. Health Route

## GET `/api/health`

Checks whether the backend server and database connection are working.

### Request

```http
GET /api/health
```

### Full URL

```text
http://localhost:3232/api/health
```

### Expected Response

```json
{
  "status": "OK",
  "message": "Server running",
  "dbTime": "2026-04-16T..."
}
```

### What it confirms

- Express server is running
- PostgreSQL connection is working
- environment variables are loaded correctly

---

# 2. Workflow Routes

Workflows are the top-level resource. Nodes and edges are attached to workflows.

## GET `/api/workflows`

Gets all workflows for the current test user.

### Full URL

```text
http://localhost:3232/api/workflows
```

### Expected Response

```json
[
  {
    "id": "workflow-uuid",
    "user_id": "test-user-uuid",
    "name": "Resume Screening Workflow",
    "description": "Parses resumes and scores candidates",
    "is_active": true,
    "created_at": "2026-04-16T..."
  }
]
```

---

## GET `/api/workflows/:id`

Gets one workflow by id.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId
```

### Expected Response

```json
{
  "id": "workflow-uuid",
  "user_id": "test-user-uuid",
  "name": "Resume Screening Workflow",
  "description": "Parses resumes and scores candidates",
  "is_active": true,
  "created_at": "2026-04-16T..."
}
```

### Common Issue

If the workflow id is wrong or does not belong to the current test user, you should get a 404-style response.

---

## POST `/api/workflows`

Creates a new workflow.

### Full URL

```text
http://localhost:3232/api/workflows
```

### Request Body

```json
{
  "name": "Resume Screening Workflow",
  "description": "Parses resumes and scores candidates"
}
```

### Expected Response

```json
{
  "id": "workflow-uuid",
  "user_id": "test-user-uuid",
  "name": "Resume Screening Workflow",
  "description": "Parses resumes and scores candidates",
  "is_active": true,
  "created_at": "2026-04-16T..."
}
```

### Notes

Copy the returned workflow `id`. You will need it for node and edge testing.

---

## PUT `/api/workflows/:id`

Updates an existing workflow.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId
```

### Request Body

```json
{
  "name": "Updated Resume Workflow",
  "description": "Updated workflow description",
  "is_active": false
}
```

### Expected Response

```json
{
  "id": "workflow-uuid",
  "user_id": "test-user-uuid",
  "name": "Updated Resume Workflow",
  "description": "Updated workflow description",
  "is_active": false,
  "created_at": "2026-04-16T..."
}
```

---

## DELETE `/api/workflows/:id`

Deletes a workflow.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId
```

### Expected Response

```json
{
  "message": "Workflow deleted",
  "workflow": {
    "id": "workflow-uuid",
    "user_id": "test-user-uuid",
    "name": "Updated Resume Workflow",
    "description": "Updated workflow description",
    "is_active": false,
    "created_at": "2026-04-16T..."
  }
}
```

### Important

Deleting a workflow may also remove related nodes and edges depending on foreign key behavior.

---

# 3. Node Routes

Nodes are the actual workflow steps.

Examples of node types:

- trigger
- ai
- condition
- action

## GET `/api/workflows/:WorkflowId/nodes`

Gets all nodes that belong to a workflow.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId/nodes
```

### Expected Response

```json
[
  {
    "id": "node-uuid",
    "workflow_id": "workflow-uuid",
    "type": "trigger",
    "label": "Webhook Trigger",
    "config": {
      "method": "POST"
    },
    "position_x": 100,
    "position_y": 200,
    "created_at": "2026-04-16T..."
  }
]
```

---

## POST `/api/workflows/:WorkflowId/nodes`

Creates a node inside a workflow.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId/nodes
```

### Request Body

```json
{
  "type": "trigger",
  "label": "Webhook Trigger",
  "config": {
    "method": "POST"
  },
  "position_x": 100,
  "position_y": 200
}
```

### Another Valid Example

```json
{
  "type": "ai",
  "label": "Analyze Resume",
  "config": {
    "prompt": "Score this resume from 1 to 100"
  },
  "position_x": 300,
  "position_y": 200
}
```

### Expected Response

```json
{
  "id": "node-uuid",
  "workflow_id": "workflow-uuid",
  "type": "trigger",
  "label": "Webhook Trigger",
  "config": {
    "method": "POST"
  },
  "position_x": 100,
  "position_y": 200,
  "created_at": "2026-04-16T..."
}
```

### Notes

Copy the returned node `id`. You will need at least two node ids for edge testing.

---

## PUT `/api/nodes/:nodeId`

Updates an existing node.

### Full URL Example

```text
http://localhost:3232/api/nodes/NodeId
```

### Request Body

```json
{
  "type": "ai",
  "label": "Analyze Resume",
  "config": {
    "prompt": "Score this resume from 1 to 100"
  },
  "position_x": 300,
  "position_y": 200
}
```

### Expected Response

```json
{
  "id": "node-uuid",
  "workflow_id": "workflow-uuid",
  "type": "ai",
  "label": "Analyze Resume",
  "config": {
    "prompt": "Score this resume from 1 to 100"
  },
  "position_x": 300,
  "position_y": 200,
  "created_at": "2026-04-16T..."
}
```

### Common Issue

If you get a 500 error here, check:

- that the node id is real
- that `type` and `label` are included
- that the JSON body is valid
- that the controller is using the correct test user where needed

---

## DELETE `/api/nodes/:nodeId`

Deletes a node.

### Full URL Example

```text
http://localhost:3232/api/nodes/NodeId
```

### Expected Response

```json
{
  "message": "Node deleted",
  "node": {
    "id": "node-uuid",
    "workflow_id": "workflow-uuid",
    "type": "ai",
    "label": "Analyze Resume",
    "config": {
      "prompt": "Score this resume from 1 to 100"
    },
    "position_x": 300,
    "position_y": 200,
    "created_at": "2026-04-16T..."
  }
}
```

---

# 4. Edge Routes

Edges connect nodes together and define workflow order.

Example:

```text
Trigger Node -> AI Node
```

## GET `/api/workflows/:WorkflowId/edges`

Gets all edges for a workflow.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId/edges
```

### Expected Response

```json
[
  {
    "id": "edge-uuid",
    "workflow_id": "workflow-uuid",
    "source_node_id": "source-node-uuid",
    "target_node_id": "target-node-uuid",
    "created_at": "2026-04-16T..."
  }
]
```

---

## POST `/api/workflows/:WorkflowId/edges`

Creates a connection between two nodes in the same workflow.

### Full URL Example

```text
http://localhost:3232/api/workflows/WorkflowId/edges
```

### Request Body

```json
{
  "source_node_id": "YOUR_SOURCE_NODE_ID",
  "target_node_id": "YOUR_TARGET_NODE_ID"
}
```

### Expected Response

```json
{
  "id": "edge-uuid",
  "workflow_id": "workflow-uuid",
  "source_node_id": "source-node-uuid",
  "target_node_id": "target-node-uuid",
  "created_at": "2026-04-16T..."
}
```

### Validation Rules Currently Implemented

- both `source_node_id` and `target_node_id` are required
- a node cannot connect to itself
- both nodes must exist
- both nodes must belong to the specified workflow
- the workflow must belong to the current test user

---

## DELETE `/api/edges/:edgeId`

Deletes an edge.

### Full URL Example

```text
http://localhost:3232/api/edges/EdgeId
```

### Expected Response

```json
{
  "message": "Edge deleted",
  "edge": {
    "id": "edge-uuid",
    "workflow_id": "workflow-uuid",
    "source_node_id": "source-node-uuid",
    "target_node_id": "target-node-uuid",
    "created_at": "2026-04-16T..."
  }
}
```

---

# 5. Graph Route

The graph endpoint returns the full workflow structure, including:

- workflow metadata
- all nodes in the workflow
- all edges connecting the nodes

This is the most important endpoint for rendering a workflow visually.

---

## GET `/api/workflows/:id/graph`

Fetches the complete workflow graph in a single request.

### Full URL Example

```text
http://localhost:5000/api/workflows/WorkflowId/graph
```

---

# Suggested Manual Test Flow

Use this exact order for a clean end to end test:

## Step 1

Test:

```text
GET /api/health
```

## Step 2

Create a workflow:

```text
POST /api/workflows
```

Save the returned workflow id.

## Step 3

Get all workflows:

```text
GET /api/workflows
```

## Step 4

Create node 1:

```text
POST /api/workflows/:WorkflowId/nodes
```

Example:

```json
{
  "type": "trigger",
  "label": "Webhook Trigger",
  "config": {
    "method": "POST"
  },
  "position_x": 100,
  "position_y": 200
}
```

## Step 5

Create node 2:

```json
{
  "type": "ai",
  "label": "Analyze Resume",
  "config": {
    "prompt": "Score this resume from 1 to 100"
  },
  "position_x": 300,
  "position_y": 200
}
```

Save both node ids.

## Step 6

Get workflow nodes:

```text
GET /api/workflows/:WorkflowId/nodes
```

## Step 7

Create edge between node 1 and node 2:

```text
POST /api/workflows/:WorkflowId/edges
```

```json
{
  "source_node_id": "NODE_1_ID",
  "target_node_id": "NODE_2_ID"
}
```

Save the edge id.

## Step 8

Get workflow edges:

```text
GET /api/workflows/:WorkflowId/edges
```

## Step 9

Update workflow:

```text
PUT /api/workflows/:id
```

## Step 10

Update a node:

```text
PUT /api/nodes/:nodeId
```

## Step 11

Delete edge:

```text
DELETE /api/edges/:edgeId
```

## Step 12

Delete nodes if needed:

```text
DELETE /api/nodes/:nodeId
```

## Step 13

Delete workflow if needed:

```text
DELETE /api/workflows/:id
```

## Step 14

Get graph:

```text
GET /api/workflows/:id/graph
```

---

# Common Troubleshooting

## 500 Internal Server Error

Usually means one of these:

- missing or invalid id
- bad JSON request body
- SQL error
- wrong `TEST_USER_ID` in the controller
- server needs restart after code changes

Check the backend terminal for the real error message.

---

## 404 Not Found

Usually means:

- wrong route URL
- wrong workflow id, node id, or edge id
- resource does not belong to the current test user

---

## 400 Bad Request

Usually means:

- missing required fields
- invalid request shape
- trying to connect a node to itself for edge creation

---

## Database Authentication Failed

If you see a PostgreSQL password error, check `server/.env`.

If your password contains special characters, put quotes around it:

```env
DB_PASSWORD="your_real_password"
```

---

# Current Limitation

The backend currently uses a hardcoded `TEST_USER_ID` instead of real authentication.

That means:

- all workflow ownership checks depend on that test user
- all created resources must belong to that same user
- real JWT auth will replace this later

---

# Next Planned API Additions

After the current routes, the next likely backend additions are:

- auth routes
- protected routes
- execution routes
- execution step logging routes
