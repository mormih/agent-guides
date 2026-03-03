# Rule: Reproducibility

**Priority**: P0 — A model that cannot be reproduced cannot be trusted in production.

1. **Every training run versioned**: Training code (git commit), data snapshot, hyperparameters, and environment (Docker digest) logged in MLflow before training starts.
2. **Random seeds fixed**: All randomness seeded — `random.seed()`, `numpy.random.seed()`, `torch.manual_seed()`. Seed is a versioned hyperparameter.
3. **Environment pinned**: Training and inference environments fully specified via pinned `requirements.txt` or `conda.yaml`. No `>=` constraints in production specs.
4. **Data version immutable**: Training datasets are snapshots, not live views. After evaluation begins, training data cannot be modified.
5. **Re-trainable from scratch**: Same code + data + hyperparameters must produce a model within acceptable variance of the original.
