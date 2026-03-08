---
name: secret-detection
type: skill
description: Detect secrets in code, git history, and running containers — pre-commit hooks, CI scanning, and incident response for exposed credentials.
related-rules:
  - shift-left-policy.md
  - secret-hygiene.md (infrastructure)
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Secret Detection

> **Expertise:** trufflehog, gitleaks, git-secrets, pre-commit hooks, CI scanning, secret rotation playbook.

## When to load

When setting up secret scanning pre-commit or in CI, investigating a potential credential leak, or remediating secrets found in git history.

## Pre-Commit Hook Setup

```bash
# Install pre-commit
pip install pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/trufflesecurity/trufflehog
    rev: v3.88.0
    hooks:
      - id: trufflehog
        name: TruffleHog — secret scan
        entry: trufflehog git file://. --since-commit HEAD --only-verified --fail
        language: system
        pass_filenames: false

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.0
    hooks:
      - id: gitleaks
        name: Gitleaks — detect hardcoded secrets
```

```bash
# Install hooks for all team members (add to onboarding docs)
pre-commit install
pre-commit install --hook-type commit-msg

# Run against all files (one-time audit)
pre-commit run trufflehog --all-files
pre-commit run gitleaks --all-files
```

## CI: trufflehog (GitHub Actions)

```yaml
- name: Scan for secrets (trufflehog)
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
    extra_args: >
      --only-verified
      --fail
      --format json
      --json-output trufflehog-results.json
  continue-on-error: false    # hard fail

- name: Upload results
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: secret-scan-results
    path: trufflehog-results.json
```

## CI: gitleaks (GitLab CI)

```yaml
secret-scan:
  stage: validate
  image: zricethezav/gitleaks:latest
  script:
    - gitleaks detect
        --source .
        --config .gitleaks.toml
        --redact
        --exit-code 1
        --report-format json
        --report-path gitleaks-report.json
  artifacts:
    when: on_failure
    paths: [gitleaks-report.json]
```

## gitleaks Configuration (.gitleaks.toml)

```toml
# .gitleaks.toml
title = "MyProject Gitleaks Config"

[extend]
useDefault = true   # use built-in rules + extend

# Custom rule: internal API keys
[[rules]]
id = "internal-api-key"
description = "Internal API Key"
regex = '''MYCOMPANY_API_KEY_[A-Za-z0-9]{32}'''
tags = ["key", "internal"]

# Allowlist: suppress known false positives
[allowlist]
description = "Global allowlist"
regexes = [
  '''EXAMPLE_.*''',       # example values in docs
  '''test_.*_key''',      # test fixtures
]
paths = [
  '''.gitleaks.toml''',   # this file itself
  '''tests/fixtures/''',  # test data
]
commits = [
  "abc123def456"          # specific commit with known false positive
]
```

## Full Repo Audit (historical scan)

```bash
# Scan all branches and full history
trufflehog git file://. \
  --only-verified \
  --format json | tee trufflehog-full-audit.json

# Gitleaks: scan full history
gitleaks detect \
  --source . \
  --log-opts "--all" \
  --report-format json \
  --report-path gitleaks-full-audit.json

# Summary: count findings by type
cat trufflehog-full-audit.json | jq 'group_by(.DetectorName) | map({type: .[0].DetectorName, count: length})'
```

## Incident Response: Secret Exposed in Git

```bash
# STOP: rotate the secret FIRST, before anything else
# Only after rotation (new secret is active and old one invalid):

# 1. Remove from git history using git-filter-repo (safer than filter-branch)
pip install git-filter-repo

git filter-repo \
  --replace-text <(echo 'EXPOSED_SECRET==>REMOVED') \
  --force

# 2. Force push (coordinate with team — everyone must re-clone)
git push --force --all
git push --force --tags

# 3. Notify all contributors to re-clone (old clones have the secret in history)

# 4. Check if GitHub/GitLab cached the secret (check forks, PRs, CI logs)
# GitHub: check cached pipelines in CI for the old secret
# GitLab: check CI job logs, pipeline artifacts

# 5. Audit: who may have cloned or cached the repo during exposure window
# Check VCS audit logs for clone events

# 6. File security incident report
```

## False Positive Management

```bash
# Inline suppression (trufflehog)
SOME_VAR="obviously-not-a-secret"  # trufflehog:ignore

# Inline suppression (gitleaks)
SOME_VAR="test-value"  # gitleaks:allow

# .gitleaksignore file (commit-hash based)
# Get commit hash of false positive commit:
git log --oneline | grep "Add example config"
# Add to .gitleaksignore:
echo "abc123def456:path/to/file.yaml" >> .gitleaksignore
```
