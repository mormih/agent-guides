# `.agent-os` Domain Package: Machine Learning (MLOps)

> **Version**: 1.0.0
> **Stack**: Python / PyTorch / MLflow / Kubeflow / Ray / Triton Inference Server
> **Scope**: Model lifecycle from experimentation to production — training, evaluation, deployment, monitoring
> **Inherits from**: `@agent-os/global`, `@agent-os/security`, `@agent-os/data-engineering` (feature data quality)

---

## Package Structure

```
.agent-os/
└── mlops/
    ├── rules/
    │   ├── reproducibility.md
    │   ├── model-governance.md
    │   ├── data-integrity.md
    │   └── production-safety.md
    ├── skills/
    │   ├── feature-engineering.md
    │   ├── model-evaluation.md
    │   ├── experiment-tracking.md
    │   ├── training-infrastructure.md
    │   ├── inference-serving.md
    │   └── model-monitoring.md
    └── workflows/
        ├── train-experiment.md
        ├── evaluate-model.md
        ├── deploy-endpoint.md
        ├── champion-challenger.md
        └── model-incident.md
```

---

## RULES (Kernel)

---

### `rules/reproducibility.md`

# Rule: Reproducibility

**Priority**: P0 — A model that cannot be reproduced cannot be trusted in production.

## Constraints

1. **Every training run is versioned**: Training code (git commit), data snapshot (version or hash), hyperparameters, and environment (Docker image digest) must be logged in the experiment tracker (MLflow) before training begins.
2. **Random seeds are fixed**: All randomness must be seeded — `random.seed()`, `numpy.random.seed()`, `torch.manual_seed()`, `tf.random.set_seed()`. Seed value is a versioned hyperparameter.
3. **Environment pinned**: Training and inference environments must be fully specified via pinned `requirements.txt` or `conda.yaml`. No `>=` version constraints in production environment specs.
4. **Data version immutable**: Training datasets are snapshots, not live views. After a model enters evaluation, the training data cannot be modified.
5. **Re-trainable from scratch**: Given the same code + data version + hyperparameters, training must produce a model within acceptable variance of the original. "Black box" models that cannot be retrained are forbidden.

---

### `rules/model-governance.md`

# Rule: Model Governance

**Priority**: P0 — Ungoverned models in production are a compliance and reliability risk.

## Constraints

1. **No model promotion without evaluation**: A model cannot be deployed to production without a documented evaluation scorecard comparing it to the current champion model. Evaluation must be performed on a held-out test set, not the training set.
2. **Human approval gate**: Model promotion to production requires sign-off from: (a) the ML engineer, (b) the product owner, and optionally (c) a fairness reviewer for high-stakes decisions.
3. **Model registry is the gate**: All production models are registered in the model registry (MLflow Model Registry / AWS SageMaker Model Registry) with stage transitions: `Staging → Production`. Ad-hoc deployment scripts that bypass the registry are forbidden.
4. **Deployment audit trail**: Every production model deployment records: who deployed it, when, which evaluation scorecard it passed, and a rollback procedure.
5. **Model cards required**: Every model in production must have a model card documenting: intended use, performance metrics by subgroup, known limitations, and bias assessment.

---

### `rules/data-integrity.md`

# Rule: Data Integrity for ML

**Priority**: P0 — Data leakage produces models that appear excellent but fail in production.

## Constraints

1. **Strict train/validation/test split**: Test sets are touched exactly once — when evaluating the final candidate model. Using the test set for any hyperparameter decisions or iteration is data leakage.
2. **Temporal splits for time-series data**: For any data with a time component, splits must respect temporal ordering. No random shuffling that would put future data in training set.
3. **Feature computation at inference must match training**: Features computed during training must be identical in definition and computation path to features available at inference time. Any divergence is training-serving skew.
4. **No target leakage**: Features used in training must be available at prediction time. Features that contain information derived from the target variable are forbidden.
5. **Feature provenance documented**: Every feature must be traceable to a data source and computation logic. Undocumented features cannot be promoted to production.

---

### `rules/production-safety.md`

# Rule: Production Safety

**Priority**: P1 — Required before any model serves real traffic.

## Constraints

1. **Fallback mechanism**: Every model endpoint must have a defined fallback: rule-based baseline, previous model version, or graceful degradation. Cascading failures from model unavailability are unacceptable.
2. **Latency SLO**: Inference endpoints must define and enforce a latency SLO (e.g., p99 < 200ms). Models that cannot meet SLO in benchmark must not be deployed until optimized.
3. **Prediction monitoring**: All production models must log predictions with input features and timestamps. Prediction monitoring must be active before go-live.
4. **Shadow mode before production**: High-stakes models (credit decisions, medical, fraud) must run in shadow mode for ≥ 2 weeks before receiving live traffic.
5. **Concept drift alerting**: Alerts must be configured for input data distribution shift (feature drift) and output distribution shift (prediction drift) against the training baseline.

---

## SKILLS (Libraries)

---

### `skills/feature-engineering.md`

# Skill: Feature Engineering

## When to load

When building training datasets, designing feature pipelines, implementing feature stores, or debugging training-serving skew.

## Feature Types & Transformations

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import numpy as np

# ✅ Declarative feature pipeline — fit on train, transform on test+inference
numeric_features = ['age', 'income', 'days_since_signup']
categorical_features = ['country', 'plan_type', 'acquisition_channel']
binary_features = ['has_verified_email', 'has_phone_number']

preprocessor = ColumnTransformer(transformers=[
    ('num', Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler()),          # Z-score normalization
    ]), numeric_features),

    ('cat', Pipeline([
        ('imputer', SimpleImputer(strategy='constant', fill_value='unknown')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
    ]), categorical_features),

    ('bin', 'passthrough', binary_features),   # Binary: no transformation needed
])

# ✅ Fit ONLY on training data
preprocessor.fit(X_train)
X_train_processed = preprocessor.transform(X_train)
X_test_processed = preprocessor.transform(X_test)   # Uses train statistics
```

## Embedding Features

```python
# Text embeddings — batch processing for efficiency
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def batch_embed_texts(texts: list[str], batch_size: int = 64) -> np.ndarray:
    """Process in batches to avoid OOM on large datasets."""
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        batch_embeddings = model.encode(batch, normalize_embeddings=True)
        embeddings.append(batch_embeddings)
    return np.vstack(embeddings)
```

## Training-Serving Skew Prevention

```python
# ✅ Single feature definition used in both training and inference
# features/user_activity.py — shared module

def compute_user_features(user_id: str, reference_date: datetime) -> dict:
    """
    Compute features as of reference_date.
    Used by: training pipeline (historical dates) AND inference API (current date).
    This guarantees identical computation in both contexts.
    """
    orders = db.query(
        "SELECT * FROM orders WHERE user_id = %s AND created_at < %s",
        (user_id, reference_date)
    )
    return {
        "order_count_30d": count_in_window(orders, reference_date, days=30),
        "avg_order_value_90d": avg_in_window(orders, reference_date, days=90),
        "days_since_last_order": days_since_last(orders, reference_date),
    }
```

---

### `skills/model-evaluation.md`

# Skill: Model Evaluation

## When to load

When evaluating a trained model, comparing model versions, performing fairness analysis, or writing an evaluation scorecard.

## Evaluation Scorecard Template

```python
from dataclasses import dataclass
from sklearn.metrics import (
    roc_auc_score, f1_score, precision_recall_curve,
    mean_absolute_error, r2_score
)

@dataclass
class EvaluationScorecard:
    model_name: str
    model_version: str
    eval_date: str
    dataset_version: str
    test_set_size: int

    # Classification metrics
    auc_roc: float
    f1_score: float
    precision_at_threshold: float
    recall_at_threshold: float
    decision_threshold: float

    # Business metrics
    business_metric_name: str   # e.g., "Revenue lift at top 10% predictions"
    business_metric_value: float

    # Fairness metrics (required for high-stakes models)
    demographic_parity_diff: float   # Max disparity across groups; < 0.1 is acceptable
    equalized_odds_diff: float

    # vs. Champion (existing production model)
    champion_auc_roc: float
    improvement_pct: float

    passed: bool  # True if all thresholds met
```

## Threshold Selection Strategy

```python
import matplotlib.pyplot as plt
from sklearn.metrics import precision_recall_curve

def select_optimal_threshold(y_true, y_prob, business_objective: str):
    """
    business_objective options:
    - 'max_f1': balanced precision/recall
    - 'high_precision': minimize false positives (fraud detection)
    - 'high_recall': minimize false negatives (cancer screening)
    - 'business_value': maximize custom value function
    """
    precisions, recalls, thresholds = precision_recall_curve(y_true, y_prob)

    if business_objective == 'max_f1':
        f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-8)
        optimal_idx = np.argmax(f1_scores)
    elif business_objective == 'high_precision':
        # Find highest threshold where recall >= 0.5
        valid = recalls >= 0.5
        optimal_idx = np.argmax(precisions[valid])

    return thresholds[optimal_idx]
```

## Subgroup Fairness Analysis

```python
def evaluate_fairness(y_true, y_pred, sensitive_attribute):
    """Required for any model making decisions about people."""
    groups = sensitive_attribute.unique()
    results = {}

    for group in groups:
        mask = sensitive_attribute == group
        results[group] = {
            "n": mask.sum(),
            "positive_rate": y_pred[mask].mean(),          # Demographic parity
            "tpr": recall_score(y_true[mask], y_pred[mask]),   # Equal opportunity
            "fpr": (y_pred[mask] & ~y_true[mask]).mean(),   # Equalized odds
        }

    # Demographic parity difference (max - min positive rate)
    pos_rates = [r["positive_rate"] for r in results.values()]
    dp_diff = max(pos_rates) - min(pos_rates)

    if dp_diff > 0.1:
        logger.warning(f"Demographic parity difference {dp_diff:.3f} exceeds 0.1 threshold")

    return results, dp_diff
```

---

### `skills/experiment-tracking.md`

# Skill: Experiment Tracking

## When to load

When running training experiments, comparing runs, or reproducing a historical experiment.

## MLflow Tracking Pattern

```python
import mlflow
import mlflow.pytorch

mlflow.set_tracking_uri(settings.MLFLOW_TRACKING_URI)
mlflow.set_experiment("churn-prediction-v2")

with mlflow.start_run(run_name="xgboost-lr-0.01-depth-6") as run:
    # Log all hyperparameters
    mlflow.log_params({
        "model_type": "xgboost",
        "learning_rate": 0.01,
        "max_depth": 6,
        "n_estimators": 500,
        "data_version": dataset_version,
        "random_seed": 42,
    })

    # Log system info
    mlflow.set_tags({
        "git_commit": subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip(),
        "author": "ml-team",
        "purpose": "hyperparameter-search",
    })

    # Train model
    model = train_model(X_train, y_train, hyperparams)

    # Log metrics at each epoch
    for epoch, metrics in training_history.items():
        mlflow.log_metrics(metrics, step=epoch)

    # Log final evaluation metrics
    mlflow.log_metrics({
        "test_auc_roc": 0.847,
        "test_f1": 0.731,
        "test_precision": 0.782,
        "test_recall": 0.687,
    })

    # Log model with input/output schema
    signature = mlflow.models.infer_signature(X_train, model.predict(X_train))
    mlflow.xgboost.log_model(model, "model", signature=signature)

    # Log artifacts
    mlflow.log_artifact("confusion_matrix.png")
    mlflow.log_artifact("feature_importance.png")
    mlflow.log_artifact("evaluation_scorecard.json")

    run_id = run.info.run_id
    print(f"Run ID: {run_id}")
```

---

### `skills/inference-serving.md`

# Skill: Inference Serving

## When to load

When deploying a model to an API endpoint, optimizing inference latency, containerizing a model, or designing serving infrastructure.

## FastAPI Inference Endpoint Pattern

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
import mlflow.pyfunc
import numpy as np

app = FastAPI()

# Load model at startup, not on each request
@app.on_event("startup")
def load_model():
    app.state.model = mlflow.pyfunc.load_model(f"models:/churn-predictor/Production")
    app.state.preprocessor = load_preprocessor()  # Must match training preprocessor

class PredictionRequest(BaseModel):
    user_id: str
    features: dict

    @validator('features')
    def validate_feature_keys(cls, v):
        required = {'age', 'income', 'days_since_signup', 'country'}
        missing = required - set(v.keys())
        if missing:
            raise ValueError(f"Missing required features: {missing}")
        return v

class PredictionResponse(BaseModel):
    user_id: str
    churn_probability: float
    model_version: str
    prediction_id: str  # For monitoring/logging

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    start_time = time.time()
    try:
        features = app.state.preprocessor.transform([request.features])
        probability = app.state.model.predict(features)[0]

        # Log prediction for monitoring
        log_prediction(
            prediction_id=str(uuid.uuid4()),
            user_id=request.user_id,
            input_features=request.features,
            prediction=float(probability),
        )

        return PredictionResponse(
            user_id=request.user_id,
            churn_probability=float(probability),
            model_version=app.state.model.metadata.run_id[:8],
            prediction_id=prediction_id,
        )
    except Exception as e:
        logger.error("Inference failed", error=str(e), user_id=request.user_id)
        # Return fallback, don't crash
        return PredictionResponse(
            user_id=request.user_id,
            churn_probability=FALLBACK_PROBABILITY,
            model_version="fallback",
            prediction_id="fallback",
        )
    finally:
        INFERENCE_LATENCY.observe(time.time() - start_time)
```

## Latency Optimization Checklist

- [ ] Model loaded at startup, not per request
- [ ] Input preprocessing vectorized (batch), not row-by-row
- [ ] Model converted to ONNX for framework-agnostic optimization
- [ ] Batch inference enabled for high-throughput scenarios
- [ ] Response cached for identical inputs (if input space is bounded)
- [ ] GPU inference enabled for deep learning models (check cost vs. latency tradeoff)

---

### `skills/model-monitoring.md`

# Skill: Model Monitoring

## When to load

When setting up monitoring for a deployed model, investigating prediction quality degradation, or responding to drift alerts.

## Monitoring Dimensions

```
1. Operational health (always monitored)
   - Latency: p50, p95, p99 per endpoint
   - Throughput: requests/second
   - Error rate: prediction failures, input validation failures
   - Resource: CPU/GPU utilization, memory

2. Data drift (monitored against training baseline)
   - Feature drift: statistical distribution of each input feature
     → PSI (Population Stability Index) > 0.2 = significant shift
   - Prediction drift: distribution of model output scores

3. Model quality (monitored when labels available)
   - Accuracy metrics (ground truth available after delay)
   - Business outcome correlation (e.g., predicted churn vs. actual churn 30 days later)
```

## PSI (Population Stability Index) Drift Detection

```python
def calculate_psi(expected: np.ndarray, actual: np.ndarray, buckets: int = 10) -> float:
    """
    PSI < 0.1: No significant change
    PSI 0.1-0.2: Moderate change — investigate
    PSI > 0.2: Significant change — retrain likely needed
    """
    breakpoints = np.percentile(expected, np.linspace(0, 100, buckets + 1))
    expected_counts = np.histogram(expected, breakpoints)[0] / len(expected)
    actual_counts = np.histogram(actual, breakpoints)[0] / len(actual)

    # Add small epsilon to avoid log(0)
    expected_counts = np.clip(expected_counts, 1e-4, None)
    actual_counts = np.clip(actual_counts, 1e-4, None)

    psi = np.sum((actual_counts - expected_counts) * np.log(actual_counts / expected_counts))
    return psi
```

---

## WORKFLOWS (Applications)

---

### `workflows/train-experiment.md`

# Workflow: `/train-experiment`

**Trigger**: `/train-experiment [--model churn-predictor] [--config config/xgboost_v2.yaml]`

**Purpose**: Launch a reproducible training run with full experiment tracking.

## Steps

```
Step 1: VALIDATE prerequisites
  - Confirm data version exists and quality checks passed
  - Verify training config YAML is valid
  - Check compute resources available (GPU hours budget)

Step 2: SNAPSHOT environment
  - Log git commit hash
  - Build training Docker image (or verify digest exists)
  - Register data snapshot version in MLflow

Step 3: LAUNCH training
  - Submit job to training cluster (Kubernetes job / Ray cluster / SageMaker)
  - Stream training logs; surface loss curves in real-time

Step 4: VALIDATE training completion
  - Confirm all epochs completed (no silent failures)
  - Check training loss decreased monotonically (flag anomalies)
  - Verify model artifact saved and logged to MLflow

Step 5: AUTO-EVALUATE
  - Run /evaluate-model on the trained model automatically
  - Compare against current champion metrics

Step 6: REPORT
  - MLflow run URL
  - Training metrics summary (loss curve, final metrics)
  - Comparison table vs. top 3 previous runs
  - Recommendation: promote to staging / continue tuning / investigate
```

---

### `workflows/evaluate-model.md`

# Workflow: `/evaluate-model`

**Trigger**: `/evaluate-model [--run-id abc123] [--compare-to champion]`

**Purpose**: Generate a comprehensive evaluation scorecard and compare against the champion model.

## Steps

```
Step 1: LOAD model and test data
  - Retrieve model artifact from MLflow run
  - Load held-out test set (from data version registered in run)
  - Confirm test set was NOT used during any training iteration

Step 2: COMPUTE core metrics
  Classification: AUC-ROC, F1, Precision, Recall, PR-AUC, Calibration curve
  Regression: MAE, RMSE, R², MAPE, residual analysis
  Ranking: NDCG, MAP, MRR

Step 3: COMPUTE business metrics
  - Translate statistical metrics to business impact
  - e.g., "At 80% precision, identifies 62% of churners — est. $120K saved/month"

Step 4: FAIRNESS analysis (if model affects people)
  - Compute demographic parity difference across protected groups
  - Flag if disparity > 0.1 (requires human review before promotion)

Step 5: COMPARE to champion
  - Load champion model from Production stage in registry
  - Run same evaluation on champion
  - Statistical significance test: is challenger genuinely better?

Step 6: GENERATE scorecard
  - Save evaluation_scorecard.json with all metrics
  - Generate visualizations: confusion matrix, ROC curve, calibration plot, feature importance
  - Recommendation: PROMOTE / DO_NOT_PROMOTE / NEEDS_REVIEW
```

---

### `workflows/deploy-endpoint.md`

# Workflow: `/deploy-endpoint`

**Trigger**: `/deploy-endpoint [--model churn-predictor] [--run-id abc123] [--shadow | --canary | --full]`

**Purpose**: Deploy a model to production following a staged rollout strategy.

## Steps

```
Step 1: PRE-FLIGHT checks
  - Confirm model passed /evaluate-model with PROMOTE recommendation
  - Verify human approval recorded in model registry (required by governance rules)
  - Check production endpoint health (don't deploy to degraded infra)

Step 2: SHADOW deployment (if --shadow)
  - Deploy model alongside current champion
  - Route 100% of traffic to champion; mirror to challenger (no response served from challenger)
  - Run shadow for minimum 48 hours
  - Compare predictions: measure agreement rate and divergence cases

Step 3: CANARY deployment (if --canary or after shadow)
  - Serve challenger to 5% of traffic
  - Monitor for 30 minutes:
    → Latency p99 > SLO threshold: AUTO-ROLLBACK
    → Error rate > 1%: AUTO-ROLLBACK
    → Prediction distribution wildly different from shadow results: PAUSE for review
  - Gradually increase: 5% → 20% → 50% → 100%

Step 4: PROMOTE champion
  - Transition model stage: Staging → Production in registry
  - Demote old champion: Production → Archived
  - Update endpoint to serve new model 100%

Step 5: POST-DEPLOY monitoring
  - Establish new baseline for drift monitoring (from new model's predictions)
  - Confirm monitoring dashboards updated
  - Notify stakeholders of deployment completion
```

---

### `workflows/champion-challenger.md`

# Workflow: `/champion-challenger`

**Trigger**: `/champion-challenger [--champion model-v1] [--challenger model-v2] [--duration 14d]`

**Purpose**: Run a formal A/B test between two model versions with statistical rigor.

## Steps

```
Step 1: DESIGN experiment
  - Define primary metric (business outcome, not just model metric)
  - Calculate required sample size for statistical power (80% power, α=0.05)
  - Define guardrail metrics (latency, error rate)

Step 2: CONFIGURE traffic split
  - Hash user_id to ensure consistent assignment (same user always sees same model)
  - Assign 50% to champion, 50% to challenger
  - Log assignment to experiment tracking system

Step 3: RUN experiment
  - Monitor guardrail metrics daily
  - Track primary metric accumulation
  - Alert if guardrail breached → auto-rollback to champion

Step 4: ANALYZE results (after minimum duration)
  - Compute statistical significance of primary metric difference
  - Check for novelty effects (early lift that disappears)
  - Segment analysis: is challenger better for ALL user segments?

Step 5: DECIDE
  - p < 0.05 AND practical significance: PROMOTE challenger
  - p >= 0.05 OR harm to any segment: KEEP champion
  - Document decision with evidence in experiment log

Step 6: CONCLUDE experiment
  - Route 100% traffic to winner
  - Archive loser model
  - Write experiment report for model registry
```

---

### `workflows/model-incident.md`

# Workflow: `/model-incident`

**Trigger**: `/model-incident [--model churn-predictor] [--type drift|degradation|outage|bias]`

**Purpose**: Respond to a production model incident with structured triage and remediation.

## Steps

```
Step 1: IMMEDIATE response
  - Assess impact: how many users affected? What decisions are being made incorrectly?
  - Decision: Can we tolerate degraded predictions, or must we roll back NOW?
  - If critical: execute rollback to previous champion immediately (< 5 min target)

Step 2: DIAGNOSE
  drift:       Compare current input distributions to training baseline using PSI
  degradation: Compare current business metrics to post-deployment baseline
  outage:      Check inference endpoint health, container logs, resource utilization
  bias:        Compute fairness metrics for affected period vs. baseline

Step 3: SCOPE affected predictions
  - Identify time window of degradation
  - Log which predictions were made during affected window
  - Notify downstream systems that relied on affected predictions

Step 4: ROOT CAUSE ANALYSIS
  - Was it data drift? (upstream data change)
  - Was it model rot? (world changed, model is stale)
  - Was it infrastructure? (feature computation pipeline failure causing skew)
  - Was it a code bug? (preprocessing mismatch between training and serving)

Step 5: REMEDIATE
  - Data drift → schedule retraining with new data
  - Model rot → trigger /train-experiment with recent data window
  - Infrastructure → fix pipeline, verify features match training definition
  - Code bug → hotfix + retrain with correct preprocessing

Step 6: POST-INCIDENT
  - Add monitoring rule to catch this pattern earlier
  - Write postmortem: timeline, impact, root cause, action items
  - Update model card with known failure modes
```

---

## Domain Boundary Notes

### MLOps ↔ Data Engineering
- **Overlap**: Feature pipelines are data pipelines; feature stores use the same infrastructure.
- **Decision**: Data Engineering owns raw-to-clean data transformation. MLOps owns clean-to-feature transformation. Feature tables in the warehouse follow Data Engineering quality and documentation rules.

### MLOps ↔ Backend SDLC
- **Overlap**: Inference endpoints are REST APIs; they follow API design, security, and reliability rules.
- **Decision**: The inference API layer (FastAPI endpoint, authentication, rate limiting) follows Backend SDLC rules. The ML-specific logic (model loading, preprocessing, prediction) follows MLOps rules.

### MLOps ↔ Platform
- **Overlap**: Training cluster management, GPU resource allocation, Kubernetes jobs for training, model serving infrastructure.
- **Decision**: Platform owns cluster infrastructure and cost governance. MLOps owns job definitions, resource requests for training jobs, and Helm values for inference deployments.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. PyTorch/MLflow/FastAPI serving stack. |
