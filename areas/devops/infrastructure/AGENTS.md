# Infrastructure guidance index

Use this map to load infrastructure-as-code guidance — Terraform module design, Ansible playbooks, state management, and cloud-agnostic provisioning patterns.

## Guidance chain

1. project `.agent/` baseline guidance
2. infrastructure `rules/*`
3. infrastructure `skills/*/SKILL.md`
4. infrastructure `workflows/*`

## Scope

- **IaC**: Terraform (primary), Ansible (configuration management), Pulumi (where used)
- **Clouds**: AWS, GCP, Hetzner, bare-metal — patterns are cloud-agnostic; cloud-specific examples annotated
- **Not in scope**: application-level K8s manifests (→ kubernetes specialization), CI/CD pipeline config (→ ci-cd specialization)

```text
infrastructure/
├── rules/
│   ├── iac-standards.md        ← Terraform/Ansible hygiene rules
│   ├── state-management.md     ← remote state, locking, isolation
│   ├── immutability.md         ← no manual changes, drift policy
│   └── secret-hygiene.md       ← no secrets in IaC code or state
├── skills/
│   ├── terraform-modules/SKILL.md
│   ├── ansible-playbooks/SKILL.md
│   ├── state-management/SKILL.md
│   ├── drift-detection/SKILL.md
│   └── cost-optimization/SKILL.md
├── workflows/
│   ├── provision-environment.md
│   ├── destroy-environment.md
│   ├── drift-remediation.md
│   └── module-development.md
└── prompts/
    └── *.md
```
