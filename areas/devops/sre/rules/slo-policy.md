# Rule: SLO Policy

**Priority**: P1 — Services in production must have defined SLOs with error budgets.

## SLO Definition Requirements

1. **Every Tier 1 service must define:**
   - **SLI** (what we measure): e.g., proportion of requests completing < 500ms
   - **SLO** (the target): e.g., 99.5% of requests complete < 500ms over 28 days
   - **Error budget**: 100% - SLO = 0.5% = ~3.6h of downtime per 28 days

2. **SLI types (choose appropriate)**

   | SLI type | Formula | Use when |
   |:---|:---|:---|
   | Availability | good_requests / total_requests | HTTP services |
   | Latency | requests_below_threshold / total_requests | Latency-sensitive APIs |
   | Throughput | actual_throughput / target_throughput | Batch/stream processing |
   | Correctness | correct_results / total_results | Data pipelines |

3. **SLO tiers**

   | Tier | Example SLO | Error budget / 28d |
   |:---|:---|:---|
   | Tier 1 (revenue) | 99.9% availability | 43 minutes |
   | Tier 2 (internal) | 99.5% availability | 3.6 hours |
   | Tier 3 (batch) | 99.0% availability | 7.2 hours |

4. **28-day rolling window** is the default measurement period. Rolling > calendar month (avoids "burn ahead" gaming).

5. **SLOs reviewed quarterly** — adjust based on actual reliability data.
