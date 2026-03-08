---
name: incident-command
type: skill
description: Structured incident command for P0/P1 — roles, timeline, communication templates, and mitigation-first approach.
related-rules:
  - on-call-standards.md
  - error-budget-policy.md
allowed-tools: Read, Bash
---

# Skill: Incident Command

> **Expertise:** ICS-inspired incident structure, communication templates, mitigation over diagnosis, blameless culture.

## When to load

When responding to a P0/P1 incident, coordinating a multi-engineer response, or writing a war room update.

## Incident Roles

| Role | Responsibility | Who |
|:---|:---|:---|
| **Incident Commander (IC)** | Owns coordination; makes go/no-go calls | On-call lead or SRE |
| **Technical Lead** | Diagnoses and implements fix | On-call engineer |
| **Comms Lead** | Writes status page + stakeholder updates | PM or secondary on-call |
| **Scribe** | Documents timeline in real-time | Any available engineer |

## P0 Timeline (first 30 minutes)

```
T+0:   ACKNOWLEDGE — "I'm on it" in #incidents Slack
T+2:   SCOPE — What's broken? Since when? Who's affected?
       → kubectl get pods -A | grep -v Running
       → Check Grafana error rate + latency dashboard
T+5:   PAGE escalation if > 10% users affected or revenue impacted
T+10:  STATUS PAGE update: "We are investigating reports of [symptom]"
T+15:  MITIGATION — Rollback > fix. Prefer reversible actions.
       Order: rollback deploy → feature flag off → scale up → redirect traffic
T+20:  COMMUNICATE — Slack update with mitigation status + ETA
T+30:  STABILIZE — Confirm metrics returning to baseline
       → Watch error rate for 10 min after mitigation
T+60:  PRELIMINARY POSTMORTEM doc created (timeline captured)
T+24h: FULL POSTMORTEM — 5-whys, action items, owners
```

## Mitigation Priority (always prefer fast+reversible)

```
1. Rollback deploy → helm rollback <release> -n <ns>    # < 2 min
2. Feature flag off → LaunchDarkly / split.io toggle    # < 1 min
3. Scale up replicas → kubectl scale deploy ... --replicas=N
4. Restart pods → kubectl rollout restart deploy/<n>
5. Redirect traffic → DNS change / load balancer weight
6. Fix forward → only if rollback is not possible
```

## Slack Communication Templates

```
# P0 Opening Message (#incidents channel)
🔴 **P0 INCIDENT OPEN** — [service] [symptom]
IC: @you | Scribe: @name
Impact: [who is affected, estimated user count]
Current status: Investigating
Thread: all updates in this thread
War room: https://meet.google.com/...

# Update every 15 min until resolved
📊 **UPDATE T+15** — [service]
Status: Mitigating / Resolved / Monitoring
Action taken: Rolled back to v2.3.0
Current error rate: 0.2% (was 8.4%)
ETA: Monitoring for 10 min, then close

# Resolution
✅ **RESOLVED** — [service] — [duration]
Root cause (preliminary): [1-sentence summary]
Mitigation: [what fixed it]
Next: Postmortem within 24h @[owner]
```

## Status Page Templates

```
# Investigating
Investigating - We are investigating reports of [symptom] affecting [service].
Users may experience [impact]. We will provide updates every 15 minutes.

# Identified
Identified - We have identified the issue causing [symptom].
We are working on a fix and expect resolution by [ETA].

# Monitoring
Monitoring - A fix has been implemented and we are monitoring the results.
Users should no longer experience [symptom].

# Resolved
Resolved - [symptom] affecting [service] has been resolved.
This incident lasted [duration]. A postmortem will be published within 72 hours.
```

## Useful Emergency Commands

```bash
# Immediate rollback
helm rollback <release-name> -n <namespace>           # rolls back 1 version
helm rollback <release-name> <revision> -n <namespace> # specific revision
helm history <release-name> -n <namespace>             # list revisions

# Scale up quickly
kubectl scale deploy <name> -n <ns> --replicas=10

# Emergency pod restart (without rollout)
kubectl delete pods -n <ns> -l app=<name>

# Check what changed recently
kubectl describe deploy <name> -n <ns> | grep -A5 "Events:"
kubectl rollout history deploy/<name> -n <ns>
```
