# Prompt: `/rbac-audit`

Use when: auditing Kubernetes RBAC before a compliance review, after a security incident, or when tightening access.

---

## Example 1 — Pre-compliance namespace audit

**EN:**
```
/rbac-audit

Target: namespace production
Goal: identify overprivileged accounts before SOC 2 review
Checks:
  - ServiceAccounts with automountServiceAccountToken: true
  - Bindings referencing cluster-admin or wildcard verbs/resources
  - Orphaned ServiceAccounts (no workload)
  - SA with cross-namespace ClusterRoleBindings
  - CI/CD SA (github-actions-sa) permissions vs required minimum
Output: findings table (SA / bound role / verdict: OK|REDUCE|REMOVE) + fix manifests
```

**RU:**
```
/rbac-audit

Цель: namespace production
Задача: выявить привилегированные аккаунты перед SOC 2 ревью
Проверки:
  - ServiceAccount с automountServiceAccountToken: true
  - Bindings ссылающиеся на cluster-admin или wildcard verbs/resources
  - Orphaned ServiceAccount (без workload)
  - SA с межnamespace ClusterRoleBinding
  - Права CI/CD SA (github-actions-sa) vs необходимый минимум
Результат: таблица находок (SA / роль / вердикт: OK|REDUCE|REMOVE) + fix манифесты
```

---

## Example 2 — Post-incident permission tightening

**EN:**
```
/rbac-audit

Context: INC-2024-091 — compromised CI token read secrets in production
Current SA: ci-runner (ci-system ns) bound to ClusterRole edit (cluster-wide)
Goal: reduce to deploy-only in target namespace only
Required operations: update Deployment image, read pod status
Forbidden: secrets access, cross-namespace access, node access
Output: replacement Role + RoleBinding (namespace-scoped) ready to apply
```

**RU:**
```
/rbac-audit

Контекст: INC-2024-091 — скомпрометированный CI токен читал secrets в production
Текущий SA: ci-runner (ns: ci-system) привязан к ClusterRole edit (весь кластер)
Задача: сократить до deploy-only в целевом namespace
Разрешённые операции: обновить image Deployment, читать статус подов
Запрещено: доступ к secrets, межnamespace доступ, доступ к нодам
Результат: замена Role + RoleBinding (namespace-scoped) готовая к применению
```
