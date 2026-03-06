---
name: performance-testing
type: skill
description: Design and execute load/stress tests with k6, establish SLO baselines, and identify bottlenecks.
related-rules:
  - quality-gates.md
  - test-strategy.md
allowed-tools: Read, Write, Edit, Bash
---

# Performance Testing Skill (k6)

> **Expertise:** k6 load/stress/soak tests, SLO baselines, threshold gates, bottleneck identification, CI integration.

## Test Type Selection

```
Load test    → Validate behavior at expected production traffic (steady state)
Stress test  → Find breaking point; gradually increase load until failure
Soak test    → Detect memory leaks / degradation over time (run 1-8 hours)
Spike test   → Simulate sudden traffic burst (10x normal in seconds)
```

## k6 Load Test Template

```javascript
// tests/performance/create-order.k6.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const orderCreationDuration = new Trend('order_creation_duration');
const failedOrders = new Counter('failed_orders');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Steady state
    { duration: '2m', target: 200 },  // Stress
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    // These are your SLO gates — CI fails if breached
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],       // < 1% errors
    order_creation_duration: ['p(99)<3000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export function setup() {
  // Create test auth token once before load test
  const res = http.post(`${BASE_URL}/auth/token`, JSON.stringify({
    username: 'loadtest@example.com', password: __ENV.TEST_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });
  return { token: res.json('access_token') };
}

export default function (data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  const start = Date.now();
  const res = http.post(
    `${BASE_URL}/api/v1/orders`,
    JSON.stringify({ items: [{ product_id: 'prod_123', quantity: 1 }] }),
    { headers },
  );

  orderCreationDuration.add(Date.now() - start);

  const ok = check(res, {
    'status is 201': (r) => r.status === 201,
    'has order id': (r) => r.json('id') !== undefined,
  });

  if (!ok) failedOrders.add(1);

  sleep(1);  // Think time between requests
}
```

## SLO Baseline Process

```bash
# 1. Run baseline on known-good release
k6 run --env BASE_URL=https://staging.myapp.com tests/performance/create-order.k6.js \
  --out json=results/baseline-$(date +%Y%m%d).json

# 2. Extract key metrics
k6 stats results/baseline-$(date +%Y%m%d).json | jq '{
  p50: .metrics.http_req_duration.values["p(50)"],
  p95: .metrics.http_req_duration.values["p(95)"],
  p99: .metrics.http_req_duration.values["p(99)"],
  error_rate: .metrics.http_req_failed.values.rate
}'

# 3. Store in performance-baselines.json
# 4. On each release candidate: compare vs. baseline
#    - p99 regression > 20% → block deploy
#    - p99 regression 10–20% → warning + required justification
```

## CI Integration (GitHub Actions)

```yaml
# .github/workflows/perf.yml
performance:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run k6 load test
      uses: grafana/k6-action@v0.3.1
      with:
        filename: tests/performance/create-order.k6.js
      env:
        BASE_URL: ${{ secrets.STAGING_URL }}
        TEST_PASSWORD: ${{ secrets.LOADTEST_PASSWORD }}
    - name: Upload results
      uses: actions/upload-artifact@v4
      with:
        name: k6-results
        path: results/
```

## Bottleneck Identification

After a test run showing latency regression, investigate in this order:

```bash
# 1. Check application metrics during test
# → CPU saturation? (> 80% sustained) → vertical scale or optimize hot path
# → Memory growing? → potential leak
# → Goroutines / threads spiking? → connection pool or lock contention

# 2. Check DB during load test
SELECT query, calls, mean_exec_time
FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5;
-- High mean_exec_time on a simple query → missing index

# 3. Check connection pool
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
-- Many 'idle in transaction' → long transactions not being released
-- Many 'waiting' → pool too small; increase max_connections or pool size

# 4. Check for lock contention
SELECT pid, wait_event_type, wait_event, query
FROM pg_stat_activity WHERE wait_event IS NOT NULL;
```

## Performance Report Template

```markdown
## Performance Test Report — [Date] — [Endpoint/Flow]

### Configuration
- Tool: k6 | Duration: 10 min | Peak VUs: 200
- Target: POST /api/v1/orders | Environment: staging

### Results vs. SLO

| Metric | Baseline | This run | SLO | Status |
|--------|----------|----------|-----|--------|
| p50 latency | 45ms | 52ms | < 200ms | ✅ |
| p95 latency | 120ms | 310ms | < 500ms | ✅ |
| p99 latency | 280ms | 890ms | < 2000ms | ⚠️ +218% |
| Error rate | 0.02% | 0.08% | < 1% | ✅ |

### Root cause of p99 regression
N+1 query in OrderRepository.list_items() — loading items one by one inside a loop.

### Remediation
Add joinedload() to the query. Estimated p99 improvement: ~400ms.
```
