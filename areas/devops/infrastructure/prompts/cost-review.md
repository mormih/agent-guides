# Prompt: `/cost-review`

Use when: auditing infrastructure costs, identifying waste, or right-sizing cloud resources.

---

## Example 1 — Monthly cloud cost audit (Hetzner + AWS)

**EN:**
```
/cost-review

Scope: full infrastructure cost audit
Cloud providers: Hetzner (bare-metal K8s cluster) + AWS (S3, SES, Route53)
Monthly budget: €2,000 / actual last 3 months: €2,800 (+40% over budget)
Terraform state available: all resources tagged with Project, Environment, Owner
Goals:
  1. Identify top-5 most expensive resources
  2. Find unused resources: stopped VMs, unattached volumes, unused LBs, idle databases
  3. Right-size: find over-provisioned nodes (< 20% average CPU/memory utilization)
  4. Spot opportunities: which workloads could use spot/preemptible instances?
  5. Output: prioritized savings plan with estimated monthly savings per action
Tools available: infracost (for TF estimate), Prometheus for utilization metrics
```

**RU:**
```
/cost-review

Скоуп: полный аудит затрат на инфраструктуру
Облачные провайдеры: Hetzner (bare-metal K8s кластер) + AWS (S3, SES, Route53)
Месячный бюджет: €2,000 / фактически последние 3 месяца: €2,800 (+40% сверх бюджета)
Terraform state доступен: все ресурсы тегированы Project, Environment, Owner
Цели:
  1. Определить топ-5 самых дорогих ресурсов
  2. Найти неиспользуемые ресурсы: остановленные ВМ, неподключённые диски, простаивающие LB и БД
  3. Right-size: найти избыточно выделенные ноды (< 20% среднего использования CPU/памяти)
  4. Spot возможности: какие workloads могут использовать spot/preemptible инстансы?
  5. Результат: приоритизированный план экономии с оценкой ежемесячной экономии на каждое действие
Доступные инструменты: infracost (для оценки TF), Prometheus для метрик использования
```

---

## Example 2 — Add cost tagging to Terraform modules

**EN:**
```
/cost-review

Task: enforce cost attribution tagging across all Terraform modules
Problem: 35% of AWS resources have no Owner or CostCenter tag; cost allocation impossible
Required tags: Project, Environment, Owner (team name), CostCenter, ManagedBy=terraform
Approach:
  1. Add locals.common_tags to all modules (project, environment, owner, cost_center)
  2. Add AWS tag policy (SCP or Config rule) that requires mandatory tags
  3. Write Terraform compliance test (using terraform-compliance or OPA conftest) that blocks plan if any resource missing mandatory tags
  4. Provide migration guide for untagged legacy resources
```

**RU:**
```
/cost-review

Задача: обязательная тегирование для распределения затрат во всех Terraform модулях
Проблема: 35% AWS ресурсов не имеют тегов Owner или CostCenter; распределение затрат невозможно
Обязательные теги: Project, Environment, Owner (название команды), CostCenter, ManagedBy=terraform
Подход:
  1. Добавить locals.common_tags во все модули (project, environment, owner, cost_center)
  2. Добавить AWS tag policy (SCP или Config rule) требующую обязательные теги
  3. Написать Terraform compliance test (через terraform-compliance или OPA conftest) блокирующий plan если у ресурса отсутствуют обязательные теги
  4. Предоставить руководство по миграции для нетегированных legacy ресурсов
```
