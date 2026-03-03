# Prompt: `/provision-env`

## Preview-окружение для ветки

```
/provision-env --env preview --branch feature/user-notifications

Подними ephemeral окружение для ветки feature/user-notifications.
Stack: EKS + RDS PostgreSQL 15 + ElastiCache Redis 7.
Subdomain: user-notifications.preview.mycompany.com
Оцени стоимость окружения в $/мес перед apply.
После создания — запусти smoke тесты и оставь comment в PR.
Teardown: автоматически через 72 часа или при merge/close PR.
```

## Инициализация staging

```
/provision-env --env staging

Инициализируй staging окружение с нуля. Region: eu-west-1.
Используй модули: terraform/modules/vpc, terraform/modules/eks-cluster, terraform/modules/rds-postgres.
Теги обязательны: Owner=platform-team, Environment=staging, CostCenter=engineering.
После apply — выведи все outputs и запиши endpoints в SSM Parameter Store под /staging/*.
```
