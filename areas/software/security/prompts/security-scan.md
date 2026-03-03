# Prompt: `/security-scan`

## Polnoe skanirovanie PR

```
/security-scan --scope all --pr

Polnoe skanirovanie tekushchego PR:
- SAST: semgrep (ruleset security-audit) + snyk code test
- Deps: snyk test + npm audit (ili pip-audit)
- Secrets: trufflehog na poslednie 50 kommitov
- IaC: checkov -d terraform/

Critical → zablokirovat merge.
High → kommentariy s SLA 72 chasa.
Sokhranit polnyy otchet: .security/scan-{timestamp}.json
```

## Tolko zavisimosti

```
/security-scan --scope deps --full

Audit vsekh zavisimostey na CVE: npm pakety, Docker base images, Python requirements.
Dlya kazhdoy Critical CVE — naydi patched versiyu ili safe alternativu.
Tablitsa: paket | CVE ID | severity | patchennaya versiya | deystvie.
```

## Tolko infrastruktura

```
/security-scan --scope infra --full

IaC security scan: checkov na terraform/, kube-score na k8s manifests.
Mapping findings na CIS Benchmark kontroly.
Prioritet: findings kasayushchiesya IAM wildcard, open security groups, unencrypted storage.
```
