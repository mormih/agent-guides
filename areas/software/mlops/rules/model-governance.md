# Rule: Model Governance

**Priority**: P0 — Ungoverned models in production are a compliance and reliability risk.

1. **No promotion without evaluation**: A model cannot be deployed without a documented evaluation scorecard comparing it to the current champion. Evaluation on held-out test set only.
2. **Human approval gate**: Model promotion requires sign-off from: ML engineer + product owner. Fairness reviewer for high-stakes models.
3. **Model registry is the gate**: All production models registered in MLflow Model Registry with stage transitions: `Staging → Production`. Ad-hoc deployment scripts forbidden.
4. **Deployment audit trail**: Every production deployment records: who, when, which scorecard, rollback procedure.
5. **Model cards required**: Every production model must have a model card: intended use, performance by subgroup, known limitations, bias assessment.
