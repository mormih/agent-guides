# Workflow: `/smoke-test`

**Trigger**: `/smoke-test [--env staging|production] [--post-deploy]`

**Purpose**: Rapid validation that core functionality works after a deployment.

## Steps

```
Step 1: VERIFY environment
  - Health check: all service endpoints respond 200
  - Auth endpoint: test login with smoke-test account
  - Database: simple read query succeeds

Step 2: EXECUTE critical path tests (15-20 tests)
  - User authentication (login/logout/password reset)
  - Core business transaction
  - Payment flow (test payment method)
  - Key API endpoints (status codes and response shapes)

Step 3: VERIFY integrations
  - Third-party webhooks: trigger and confirm receipt
  - Background jobs: enqueue and verify completion

Step 4: REPORT
  - Duration: must complete in < 5 minutes
  - If any failure: alert to #deployments immediately
  - --post-deploy + > 1 critical failure: trigger rollback
```
