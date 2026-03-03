# Workflow: `/secret-rotation`

**Trigger**: `/secret-rotation [--secret-name prod/api/database] [--emergency]`

**Purpose**: Safely rotate a production secret with zero downtime.

## Steps

```
Step 1: PREPARE new secret
  - Generate new credential (strong, random)
  - Store in Secrets Manager as new version (old version still active)

Step 2: DUAL-READ window
  - Update service to accept BOTH old and new credential
  - (If single credential only: schedule 2-min maintenance window)

Step 3: DEPLOY new secret
  - Trigger rolling restart to pick up new version
  - Monitor pod restarts and error rates

Step 4: VALIDATE
  - Confirm zero auth errors post-rotation
  - Verify old credential is rejected

Step 5: REVOKE old secret
  - Delete old version from Secrets Manager
  - Confirm no reads on old version in audit log

Step 6: DOCUMENT
  - Record in secret inventory: name, date, rotated by
  - Set next rotation date (+90 days)
```
