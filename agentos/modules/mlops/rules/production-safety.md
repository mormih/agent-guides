# Rule: Production Safety

**Priority**: P1 — Required before any model serves real traffic.

1. **Fallback mechanism**: Every model endpoint must have a defined fallback: rule-based baseline, previous model version, or graceful degradation.
2. **Latency SLO**: Inference endpoints must define and enforce a latency SLO (e.g., p99 < 200ms). Models that cannot meet SLO must be optimized before deploy.
3. **Prediction monitoring**: All production models log predictions with input features and timestamps. Monitoring must be active before go-live.
4. **Shadow mode**: High-stakes models (credit, medical, fraud) must run in shadow mode ≥ 2 weeks before live traffic.
5. **Drift alerting**: Alerts configured for input feature drift and output prediction drift vs. training baseline.
