# Rule: Supply Chain Security

**Priority**: P0 — Unsigned or unverified artifacts are blocked from production.

## SBOM (Software Bill of Materials)

1. Every container image build generates an SBOM (Syft / Trivy).
2. SBOM attached to image in OCI registry (cosign attach sbom).
3. SBOM stored for minimum 1 year per compliance requirements.

## Image Signing (Sigstore/cosign)

```bash
# Sign image after build
cosign sign --key env://COSIGN_PRIVATE_KEY \
  registry.example.com/my-service@sha256:<digest>

# Verify before deploy (in CD pipeline)
cosign verify --key env://COSIGN_PUBLIC_KEY \
  registry.example.com/my-service@sha256:<digest>
```

4. Unsigned images are blocked from production namespaces via OPA/Kyverno policy.

## Dependency Pinning

5. All `package.json`, `requirements.txt`, `go.sum` must pin exact versions.
6. `pip install requests` (unpinned) is forbidden in CI — use `requirements.txt` with hashes.
7. Base images pinned to digest in Dockerfile: `FROM python:3.12-slim@sha256:...`

## Audit Trail

8. Every build records: git commit, build timestamp, base image digest, all dependency versions.
9. Provenance attestation (SLSA level 2+) generated for production releases.
