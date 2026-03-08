---
name: sbom-supply-chain
type: skill
description: Generate, attach, and verify SBOMs (CycloneDX/SPDX) for container images; implement SLSA provenance; harden software supply chain.
related-rules:
  - supply-chain-security.md (ci-cd)
  - shift-left-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: SBOM & Supply Chain Security

> **Expertise:** Syft/Trivy SBOM generation, cosign SBOM attestation, SLSA provenance, dependency pinning, OCI attestations.

## When to load

When generating SBOMs for images, attaching attestations to OCI registry, verifying supply chain integrity, or achieving SLSA compliance.

## SBOM Generation (Syft)

```bash
# Generate CycloneDX SBOM from image (OCI)
syft registry.example.com/myorg/order-service:v1.2.3 \
  -o cyclonedx-json=sbom.cdx.json

# Generate SPDX SBOM from image
syft registry.example.com/myorg/order-service:v1.2.3 \
  -o spdx-json=sbom.spdx.json

# Generate from local directory (during build)
syft dir:. -o cyclonedx-json=sbom.cdx.json

# Generate from Dockerfile build context (before push)
syft packages docker:myimage:latest -o cyclonedx-json=sbom.cdx.json
```

## SBOM Attestation via cosign

```bash
# Sign image and attach SBOM as OCI attestation
# Step 1: Build and push image
docker buildx build --push \
  -t registry.example.com/myorg/order-service:v1.2.3 .

# Step 2: Get digest
DIGEST=$(crane digest registry.example.com/myorg/order-service:v1.2.3)

# Step 3: Generate SBOM
syft registry.example.com/myorg/order-service:v1.2.3 \
  -o cyclonedx-json=sbom.cdx.json

# Step 4: Attach SBOM as attestation (Sigstore keyless)
cosign attest \
  --predicate sbom.cdx.json \
  --type cyclonedx \
  registry.example.com/myorg/order-service@${DIGEST}

# Step 5: Verify attestation exists
cosign verify-attestation \
  --type cyclonedx \
  --certificate-identity-regexp ".*" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  registry.example.com/myorg/order-service@${DIGEST} \
  | jq '.payload | @base64d | fromjson | .predicate.metadata'
```

## GitHub Actions: Full Supply Chain Pipeline

```yaml
# .github/workflows/supply-chain.yml
jobs:
  build-sign-attest:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write         # for cosign keyless signing

    steps:
      - uses: actions/checkout@v4

      - name: Install cosign
        uses: sigstore/cosign-installer@v3

      - name: Install syft
        uses: anchore/sbom-action/download-syft@v0

      - name: Build and push
        id: build
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: registry.example.com/myorg/order-service:${{ github.sha }}

      - name: Sign image (keyless via OIDC)
        run: |
          cosign sign \
            registry.example.com/myorg/order-service@${{ steps.build.outputs.digest }}

      - name: Generate SBOM
        run: |
          syft registry.example.com/myorg/order-service@${{ steps.build.outputs.digest }} \
            -o cyclonedx-json=sbom.cdx.json

      - name: Attach SBOM attestation
        run: |
          cosign attest \
            --predicate sbom.cdx.json \
            --type cyclonedx \
            registry.example.com/myorg/order-service@${{ steps.build.outputs.digest }}

      - name: Generate SLSA provenance
        uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v2
        with:
          image: registry.example.com/myorg/order-service
          digest: ${{ steps.build.outputs.digest }}
```

## Verify Before Deploy (admission check)

```bash
# Verify image is signed before deploying
cosign verify \
  --certificate-identity-regexp "https://github.com/myorg/myrepo" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  registry.example.com/myorg/order-service@sha256:<digest>

# Kyverno policy: enforce signed images in production
# (see opa-policies skill for full Kyverno policy)
```

## Dependency Pinning (supply chain hardening)

```dockerfile
# Pin base image to digest — not just tag
FROM python:3.12-slim@sha256:abc123...   # ✅
FROM python:3.12-slim                    # ❌ tag can be replaced

# Verify base image digest in CI
crane digest python:3.12-slim
```

```bash
# Python: generate requirements with hashes (pip-compile)
pip-compile --generate-hashes requirements.in -o requirements.txt

# Install with hash verification
pip install -r requirements.txt --require-hashes

# Node: lock file with integrity hashes (automatic in npm/yarn)
npm ci   # uses package-lock.json with sha512 integrity hashes
```

## SBOM Analysis

```bash
# Scan SBOM for vulnerabilities (without re-pulling image)
grype sbom:sbom.cdx.json --fail-on high

# List all packages in SBOM
cat sbom.cdx.json | jq '.components[] | {name: .name, version: .version, purl: .purl}'

# Check for GPL licenses in SBOM
cat sbom.cdx.json | jq '.components[] | select(.licenses[]?.license.id | startswith("GPL"))'
```
