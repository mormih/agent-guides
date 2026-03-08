---
name: sigstore-signing
type: skill
description: Sign container images and artifacts with cosign (keyless via OIDC and key-based); verify signatures in CD pipelines and admission policies.
related-rules:
  - supply-chain-security.md (ci-cd)
  - shift-left-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Sigstore / cosign Signing

> **Expertise:** cosign keyless signing (Sigstore), key-based signing, signature verification, Kyverno/OPA enforcement, Rekor transparency log.

## When to load

When setting up image signing in CI, verifying signatures before deploy, or enforcing signature policies in K8s admission.

## Keyless Signing (OIDC — GitHub Actions)

```yaml
# .github/workflows/sign.yml
jobs:
  sign:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write    # ← required for keyless OIDC signing

    steps:
      - name: Install cosign
        uses: sigstore/cosign-installer@v3

      - name: Build and push
        id: build
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/myorg/order-service:${{ github.sha }}

      - name: Sign image (keyless)
        run: |
          cosign sign \
            --yes \
            ghcr.io/myorg/order-service@${{ steps.build.outputs.digest }}
          # Signature stored in Rekor transparency log
          # No private key needed — OIDC token proves identity
```

## Key-Based Signing (when OIDC not available)

```bash
# Generate signing key pair (do once; store private key in Vault)
cosign generate-key-pair
# Creates: cosign.key (private — store in Vault) + cosign.pub (public — commit to repo)

# Sign with key
cosign sign \
  --key cosign.key \
  registry.example.com/myorg/order-service:v1.2.3

# Sign in CI using secret
cosign sign \
  --key env://COSIGN_PRIVATE_KEY \    # inject from CI secret
  registry.example.com/myorg/order-service:v1.2.3
```

## Verification

```bash
# Verify keyless signature (GitHub Actions OIDC)
cosign verify \
  --certificate-identity-regexp "https://github.com/myorg/myrepo/.github/workflows/.*" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/myorg/order-service:v1.2.3

# Verify key-based signature
cosign verify \
  --key cosign.pub \
  registry.example.com/myorg/order-service:v1.2.3

# Verify and show full certificate info
cosign verify \
  --certificate-identity-regexp ".*" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/myorg/order-service:v1.2.3 | jq '.[0].optional'

# Check Rekor transparency log entry
cosign verify \
  --rekor-url https://rekor.sigstore.dev \
  ... | jq '.[0].rekorLogIndex'
```

## Verification in CD Pipeline (before deploy)

```bash
# Add to Helm pre-upgrade hook or CD pipeline
DIGEST=$(crane digest registry.example.com/myorg/order-service:${VERSION})

cosign verify \
  --certificate-identity-regexp "https://github.com/myorg/.*" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  registry.example.com/myorg/order-service@${DIGEST} || {
    echo "Image signature verification FAILED — aborting deploy"
    exit 1
  }

echo "Signature verified — proceeding with deploy"
helm upgrade ...
```

## Kyverno Policy: Enforce Signed Images

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-signed-images
spec:
  validationFailureAction: Enforce
  background: false
  rules:
    - name: verify-image-signature
      match:
        any:
          - resources:
              kinds: [Pod]
              namespaces: [production, staging]
      verifyImages:
        - imageReferences:
            - "registry.example.com/myorg/*"
          attestors:
            - count: 1
              entries:
                - keyless:
                    subject: "https://github.com/myorg/*"
                    issuer: "https://token.actions.githubusercontent.com"
                    rekor:
                      url: https://rekor.sigstore.dev
```

## Custom Attestations (beyond SBOM)

```bash
# Attach custom attestation (e.g., test results, compliance evidence)
cat > test-results.json << 'EOF'
{
  "tests_passed": 142,
  "tests_failed": 0,
  "coverage_pct": 84.2,
  "timestamp": "2024-11-15T14:22:00Z"
}
EOF

cosign attest \
  --predicate test-results.json \
  --type https://example.com/predicates/test-results/v1 \
  registry.example.com/myorg/order-service@${DIGEST}

# Verify custom attestation
cosign verify-attestation \
  --type https://example.com/predicates/test-results/v1 \
  --certificate-identity-regexp ".*" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  registry.example.com/myorg/order-service@${DIGEST} \
  | jq '.payload | @base64d | fromjson | .predicate'
```

## Signing Key Rotation

```bash
# 1. Generate new key pair
cosign generate-key-pair  # → new cosign.key + cosign.pub

# 2. Re-sign all production images with new key
for image in $(cat production-images.txt); do
  cosign sign --key new-cosign.key $image
done

# 3. Update Kyverno policy to accept BOTH old and new key during transition
# 4. After all images re-signed: remove old key from policy
# 5. Revoke old key in Vault; delete from CI secrets
```
