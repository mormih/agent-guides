# Prompt: `/vpc-design`

Use when: designing network topology for a new environment — VPC/subnet layout, security zones, firewall rules.

---

## Example 1 — Cloud-agnostic three-tier network design

**EN:**
```
/vpc-design

Environment: production
Provider: Hetzner Cloud (primary) with AWS Route53 + S3
Network topology: three-tier (public / application / data)
Requirements:
  - Public zone: load balancers only (no application servers directly exposed)
  - Application zone: K8s worker nodes (no public IPs); NAT for outbound
  - Data zone: PostgreSQL, Redis (no outbound internet at all)
  - Management zone: jump host, CI runners (VPN access only)
  - IP space: 10.0.0.0/8 total; production gets 10.10.0.0/16
  - K8s pod CIDR: 10.244.0.0/16 (separate, non-overlapping)
Deliverables:
  - Subnet allocation table (zone, CIDR, purpose)
  - Firewall rules table (source → dest, port, action)
  - Terraform VPC + subnet + firewall resources (Hetzner provider)
```

**RU:**
```
/vpc-design

Окружение: production
Провайдер: Hetzner Cloud (основной) с AWS Route53 + S3
Топология сети: три уровня (public / application / data)
Требования:
  - Public зона: только load balancers (серверы приложений не выставлены напрямую)
  - Application зона: K8s worker ноды (без публичных IP); NAT для исходящего трафика
  - Data зона: PostgreSQL, Redis (вообще без исходящего интернета)
  - Management зона: jump host, CI runners (только VPN доступ)
  - IP-пространство: 10.0.0.0/8 всего; production получает 10.10.0.0/16
  - K8s pod CIDR: 10.244.0.0/16 (отдельный, без перекрытий)
Результаты:
  - Таблица выделения подсетей (зона, CIDR, назначение)
  - Таблица правил firewall (источник → назначение, порт, действие)
  - Terraform ресурсы VPC + подсети + firewall (провайдер Hetzner)
```

---

## Example 2 — Network isolation: add staging to existing production VPC

**EN:**
```
/vpc-design

Existing: production VPC (10.10.0.0/16) with 3 subnets fully used
New requirement: add staging environment with full network isolation from production
Constraint: must use same Hetzner project (cost), but staging pods must not reach production DB
Options to evaluate:
  1. New VPC (10.20.0.0/16) + VPC peering for shared services only
  2. New subnet range in same VPC + strict firewall rules
  3. K8s network isolation only (same VPC/subnet, Cilium NetworkPolicies)
Recommend the best option for a 3-person team; include tradeoffs
If option selected, generate Terraform + NetworkPolicy for the isolation boundary
```

**RU:**
```
/vpc-design

Существующее: production VPC (10.10.0.0/16) с 3 подсетями полностью использованными
Новое требование: добавить staging окружение с полной сетевой изоляцией от production
Ограничение: должен использоваться тот же Hetzner проект (стоимость), но поды staging не должны достигать production БД
Варианты для оценки:
  1. Новый VPC (10.20.0.0/16) + VPC peering только для общих сервисов
  2. Новый диапазон подсетей в том же VPC + строгие правила firewall
  3. Только K8s сетевая изоляция (тот же VPC/подсеть, Cilium NetworkPolicies)
Рекомендовать лучший вариант для команды из 3 человек; включить трейдоффы
Если вариант выбран: сгенерировать Terraform + NetworkPolicy для границы изоляции
```
