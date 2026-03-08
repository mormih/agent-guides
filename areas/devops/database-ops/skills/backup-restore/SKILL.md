---
name: backup-restore
type: skill
description: PostgreSQL backup and restore with pgBackRest — full/incremental/WAL, PITR, K8s CronJob scheduling, and restore verification.
related-rules:
  - backup-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Backup & Restore

> **Expertise:** pgBackRest full/WAL/incremental backup, PITR, S3/MinIO storage, CronJob scheduling, CloudNativePG backup CRDs.

## When to load

When configuring backup infrastructure, running a restore, verifying backup integrity, or recovering from data loss.

## pgBackRest Configuration

```ini
# /etc/pgbackrest/pgbackrest.conf
[global]
repo1-type=s3
repo1-path=/postgres-backups
repo1-s3-bucket=mycompany-db-backups
repo1-s3-endpoint=s3.eu-west-1.amazonaws.com
repo1-s3-region=eu-west-1
repo1-s3-key=<AWS_ACCESS_KEY>
repo1-s3-key-secret=<AWS_SECRET_KEY>
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=<STRONG_PASSPHRASE>    # rotate annually
repo1-retention-full=4                  # keep 4 full backups
repo1-retention-diff=14                 # keep 14 differential backups

[global:archive-push]
compress-level=3

[production-db]
pg1-path=/var/lib/postgresql/data
pg1-host=postgres-primary
pg1-host-user=postgres
```

## PostgreSQL: Enable WAL Archiving

```sql
-- postgresql.conf (or via ALTER SYSTEM)
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'pgbackrest --stanza=production-db archive-push %p';
ALTER SYSTEM SET archive_timeout = '300';   -- archive segment at least every 5 min
SELECT pg_reload_conf();
```

## Backup Commands

```bash
# Initialize stanza (run once)
pgbackrest --stanza=production-db stanza-create

# Full backup (schedule: weekly)
pgbackrest --stanza=production-db --type=full backup

# Differential backup (changes since last full — schedule: daily)
pgbackrest --stanza=production-db --type=diff backup

# Incremental backup (changes since last backup — schedule: hourly)
pgbackrest --stanza=production-db --type=incr backup

# Check backup catalog
pgbackrest --stanza=production-db info

# Verify backup integrity (reads and checksums)
pgbackrest --stanza=production-db --set=<backup-label> check
```

## PITR Restore (Point-in-Time Recovery)

```bash
# PITR to specific timestamp (e.g., 1 minute before accidental DELETE)
# Step 1: Stop PostgreSQL
systemctl stop postgresql

# Step 2: Restore
pgbackrest --stanza=production-db \
  --delta \
  --target="2024-11-15 03:40:00+00" \
  --target-action=promote \
  --target-timeline=current \
  restore

# Step 3: Start PostgreSQL in recovery mode
systemctl start postgresql

# Step 4: Monitor recovery progress
tail -f /var/log/postgresql/postgresql.log
# Watch for: "recovery stopping before commit of transaction"
# Then:      "database system is ready to accept connections"

# Step 5: Verify data integrity
psql -c "SELECT count(*) FROM orders WHERE created_at > '2024-11-15 03:39:00';"
```

## K8s CronJob: Automated Backups

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup-daily
  namespace: database
spec:
  schedule: "0 2 * * *"      # 02:00 UTC daily
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: postgres-backup
          restartPolicy: OnFailure
          containers:
            - name: pgbackrest
              image: pgbackrest/pgbackrest:2.50
              command:
                - /bin/sh
                - -c
                - |
                  pgbackrest --stanza=production-db --type=diff backup
                  pgbackrest --stanza=production-db check
              envFrom:
                - secretRef:
                    name: pgbackrest-s3-credentials
              volumeMounts:
                - name: pgbackrest-config
                  mountPath: /etc/pgbackrest
          volumes:
            - name: pgbackrest-config
              configMap:
                name: pgbackrest-config
```

## CloudNativePG Backup (K8s Operator)

```yaml
# Cluster with scheduled backup
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
spec:
  backup:
    barmanObjectStore:
      destinationPath: s3://mycompany-db-backups/production
      s3Credentials:
        accessKeyId:
          name: s3-creds
          key: ACCESS_KEY_ID
        secretAccessKey:
          name: s3-creds
          key: SECRET_ACCESS_KEY
      wal:
        compression: gzip
      data:
        compression: gzip
    retentionPolicy: "30d"

---
# Scheduled backup CRD
apiVersion: postgresql.cnpg.io/v1
kind: ScheduledBackup
metadata:
  name: postgres-daily
spec:
  schedule: "0 2 * * *"
  backupOwnerReference: self
  cluster:
    name: postgres-cluster
```

## Restore Verification Script (weekly)

```bash
#!/bin/bash
# verify-backup.sh — restore to isolated pod and check row counts

STANZA="production-db"
RESTORE_HOST="postgres-restore-test"
TABLES=("orders" "payments" "users")

echo "=== pgBackRest Backup Verification $(date) ==="

# 1. Check last backup age
LAST_BACKUP=$(pgbackrest --stanza=$STANZA info --output=json | \
  jq -r '.[] | .backup[-1].timestamp.stop')
echo "Last backup: $LAST_BACKUP"

AGE_HOURS=$(( ($(date +%s) - $(date -d "$LAST_BACKUP" +%s)) / 3600 ))
if [ $AGE_HOURS -gt 26 ]; then
  echo "ERROR: Last backup is ${AGE_HOURS}h old — exceeds 26h threshold"
  exit 1
fi

# 2. Restore to test instance
pgbackrest --stanza=$STANZA --delta --pg1-host=$RESTORE_HOST restore

# 3. Start test PostgreSQL
pg_ctl -D /var/lib/postgresql/restore -l /tmp/restore.log start

# 4. Verify row counts match production
for table in "${TABLES[@]}"; do
  PROD_COUNT=$(psql -h postgres-primary -c "SELECT count(*) FROM $table;" -t | tr -d ' ')
  REST_COUNT=$(psql -h $RESTORE_HOST -c "SELECT count(*) FROM $table;" -t | tr -d ' ')
  if [ "$PROD_COUNT" != "$REST_COUNT" ]; then
    echo "MISMATCH in $table: prod=$PROD_COUNT restore=$REST_COUNT"
    FAILED=1
  else
    echo "OK: $table = $PROD_COUNT rows"
  fi
done

pg_ctl -D /var/lib/postgresql/restore stop

[ -z "$FAILED" ] && echo "BACKUP VERIFICATION PASSED" || exit 1
```
