# Rule: Quality Gates

**Priority**: P1 — Gates below minimum thresholds block promotion to production.

## Gate Thresholds

| Gate | Minimum | Block on |
|:---|:---|:---|
| Unit test coverage (critical paths) | 80% | < 70% |
| Integration tests | all pass | any failure |
| SAST findings | 0 Critical/High unresolved | any Critical/High |
| Dependency CVE | 0 Critical/High unresolved | any Critical/High |
| Secrets scan | 0 findings | any finding |
| Image scan | 0 Critical/High CVEs | any Critical/High |
| Smoke tests (staging) | 100% pass | any failure |

## Promotion Rules

1. Code merges to `main` only after all CI gates pass.
2. Staging deployment is automatic on `main` merge.
3. Production deployment requires:
   - Staging deployment healthy for ≥ 15 minutes
   - Manual approval from team-lead or on-call
   - No active P0/P1 incidents
