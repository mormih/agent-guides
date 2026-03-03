# Prompt: `/provision-env`

## Preview-okruzhenie dlya vetki

```
/provision-env --env preview --branch feature/user-notifications

Podnimi ephemeral okruzhenie dlya vetki feature/user-notifications.
Stack: EKS + RDS PostgreSQL 15 + ElastiCache Redis 7.
Subdomain: user-notifications.preview.mycompany.com
Otseni stoimost okruzheniya v $/mes pered apply.
Posle sozdaniya — zapusti smoke testy i ostav comment v PR.
Teardown: avtomaticheski cherez 72 chasa ili pri merge/close PR.
```

## Initsializatsiya staging

```
/provision-env --env staging

Initsializiruy staging okruzhenie s nulya. Region: eu-west-1.
Ispolzuy moduli: terraform/modules/vpc, terraform/modules/eks-cluster, terraform/modules/rds-postgres.
Tegi obyazatelny: Owner=platform-team, Environment=staging, CostCenter=engineering.
Posle apply — vyvedi vse outputs i zapishi endpoints v SSM Parameter Store pod /staging/*.
```
