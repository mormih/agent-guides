# Skill: Performance Testing (k6)

## When to load

When load testing a new API, establishing baselines, or investigating latency regressions.

## k6 Template

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
    errors: ['rate<0.01'],
  },
};
```

## Performance Baseline Process

```
1. Establish baseline on stable release
2. Run under realistic production-like load
3. Record p50, p95, p99 latency; error rate; throughput
4. Store in performance-baselines.json
5. Per release candidate: compare vs. baseline
   - p99 regression > 20%: block deploy
   - p99 regression 10-20%: warning + justification
```
