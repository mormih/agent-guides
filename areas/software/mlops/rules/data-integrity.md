# Rule: Data Integrity for ML

**Priority**: P0 — Data leakage produces models that appear excellent but fail in production.

1. **Strict train/val/test split**: Test set touched exactly once — for final candidate evaluation. Using test set for hyperparameter decisions is data leakage.
2. **Temporal splits for time-series**: Splits must respect temporal ordering. No random shuffling that puts future data in training set.
3. **Training-serving feature parity**: Features computed during training must be identical in definition to features available at inference time. Any divergence is training-serving skew.
4. **No target leakage**: Features must be available at prediction time. Features derived from the target variable are forbidden.
5. **Feature provenance documented**: Every feature traceable to data source and computation logic. Undocumented features cannot be promoted to production.
