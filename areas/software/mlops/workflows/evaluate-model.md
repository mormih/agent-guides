# Workflow: `/evaluate-model`

**Trigger**: `/evaluate-model [--run-id abc123] [--compare-to champion]`

## Workflow

```
@qa (compute metrics & fairness analysis) → @team-lead (review scorecard & decision) → Report
```

## Steps

```
Step 1: LOAD model and test data
  - Retrieve model artifact from MLflow run
  - Load held-out test set (from data version in run)
  - Confirm test set NOT used during any training iteration

Step 2: COMPUTE core metrics
  Classification: AUC-ROC, F1, Precision, Recall, PR-AUC
  Regression: MAE, RMSE, R², MAPE

Step 3: COMPUTE business metrics
  - Translate statistical metrics to business impact
  - e.g., "At 80% precision, identifies 62% of churners — est. $120K saved/month"

Step 4: FAIRNESS analysis (if model affects people)
  - Demographic parity difference across protected groups
  - Flag if disparity > 0.1: requires human review before promotion

Step 5: COMPARE to champion
  - Load champion from Production stage in registry
  - Statistical significance test

Step 6: GENERATE scorecard
  - Save evaluation_scorecard.json
  - Visualizations: confusion matrix, ROC curve, feature importance
  - Recommendation: PROMOTE / DO_NOT_PROMOTE / NEEDS_REVIEW
```
