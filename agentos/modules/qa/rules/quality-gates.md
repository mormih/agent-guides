# Rule: Quality Gates

**Priority**: P0 — CI must enforce gates automatically.

## Merge Gates (Block PR)

| Gate | Threshold |
|:---|:---|
| Unit test pass rate | 100% |
| Integration test pass rate | 100% |
| Coverage (business logic) | ≥ 80% |
| SAST scan | Zero Critical/High |
| Dependency audit | Zero Critical CVEs |
| Type check | Zero errors |
| Lint | Zero errors |

## Deploy Gates (Block Deploy)

| Gate | Threshold |
|:---|:---|
| E2E smoke suite | 100% pass |
| Performance regression | p99 latency +20% vs. baseline |
| Accessibility scan | Zero WCAG Level A violations |
| E2E regression suite | ≥ 98% pass rate |

## Flakiness Gate

Test failing intermittently > 2% of runs on `main` is automatically quarantined until fixed.
