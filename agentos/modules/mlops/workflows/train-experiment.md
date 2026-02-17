# Workflow: `/train-experiment`

**Trigger**: `/train-experiment [--model churn-predictor] [--config config/xgboost_v2.yaml]`

## Steps

```
Step 1: VALIDATE prerequisites
  - Confirm data version exists and quality checks passed
  - Verify training config YAML is valid
  - Check compute resource budget

Step 2: SNAPSHOT environment
  - Log git commit hash
  - Build/verify training Docker image digest
  - Register data snapshot version in MLflow

Step 3: LAUNCH training
  - Submit job to training cluster
  - Stream training logs; surface loss curves in real-time

Step 4: VALIDATE completion
  - Confirm all epochs completed
  - Check training loss decreased monotonically
  - Verify model artifact logged to MLflow

Step 5: AUTO-EVALUATE
  - Run /evaluate-model automatically
  - Compare against current champion

Step 6: REPORT
  - MLflow run URL
  - Training metrics summary
  - Comparison vs. top 3 previous runs
  - Recommendation: promote / continue tuning / investigate
```
