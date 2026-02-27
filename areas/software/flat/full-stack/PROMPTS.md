# PROMPTS: full-stack

Use these prompts with `full-stack/AGENTS.md` from the same directory.

## 1) Backend Feature Impl

```text
# Prompt: Backend Feature Implementation
workflow: feature-implementation-flow

# Context
feature_request: >
  Add a "refund_order" endpoint.
  - Input: order_id, reason
  - Logic: Check if order is PAID. If yes, create transaction, update status to REFUNDED, emit event.
  - If order is not PAID, return 400.

# Constraints
existing_codebase: ./src
```

## 2) Backend New Project

```text
# Prompt: New Backend Project
workflow: backend-project-full-cycle

# Project Details
project_name: order-service
project_dir: src
business_logic_description: >
  A service to manage customer orders.
  - Create Order (Draft)
  - Pay Order (Processing -> Paid)
  - Cancel Order
  - List Orders (with pagination)

# Tech Stack (Optional - Agent will ask if omitted)
tech_stack:
  language: Python 3.12
  framework: FastAPI
  database: PostgreSQL
  messaging: RabbitMQ
```

## 3) Backend Run Tests

```text
# Prompt: Run Tests (Backend)
workflow: testing-ci-pipeline

# Inputs
project_type: backend
test_scope: all
```

## 4) Frontend Run Tests

```text
# Prompt: Run Tests (Frontend)
workflow: testing-ci-pipeline

# Inputs
project_type: frontend
test_scope: unit
```
