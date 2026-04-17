# AI Workflow Automation

A full-stack workflow automation platform that lets users build and run multi-step workflows using triggers, AI nodes, condition nodes, and action nodes.

## Overview

This project is being built as a portfolio quality software engineering project focused on backend systems, workflow orchestration, database design, and later frontend workflow visualization.

The long term goal is to create a platform where users can:

- create workflows
- add nodes as workflow steps
- connect nodes with edges
- execute workflows step by step
- log execution history and results
- eventually authenticate and manage their own workflows securely

Example future workflow:

Webhook Trigger → AI Analyze Text → Condition Check → Action Output

## Current Progress

### Completed so far

- project folder structure
- Git and GitHub setup
- Express backend setup
- PostgreSQL database setup
- PostgreSQL schema creation
- database connection with environment variables
- health check API route
- workflow CRUD routes
- node CRUD routes
- edge CRUD routes

### In progress

1. Auth
2. Protected routes
3. Execution engine
4. Frontend builder

## Tech Stack

### Backend

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- cors

### Dev Tools

- Git
- GitHub
- nodemon
- pgAdmin
- Postman

### Planned Frontend

- React
- Vite
- React Flow

## Project Structure

```text
ai-workflow-automation/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── workflowController.js
│   │   │   └── nodeController.js
│   │   ├── routes/
│   │   │   ├── workflowRoutes.js
│   │   │   └── nodeRoutes.js
│   │   ├── middleware/
│   │   ├── models/
│   │   │   ├── workflowModel.js
│   │   │   └── nodeModel.js
│   │   ├── services/
│   │   ├── engine/
│   │   ├── nodes/
│   │   ├── app.js
│   │   └── server.js
│   ├── sql/
│   │   └── schema.sql
│   ├── .env
│   └── package.json
│
├── shared/
├── .gitignore
└── README.md
```
