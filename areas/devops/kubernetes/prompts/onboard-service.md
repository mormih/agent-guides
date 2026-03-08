# Prompt: `/onboard-service`

Use when: deploying a new application to Kubernetes for the first time — namespace through monitoring.

---

## Example 1 — Internal backend service

**EN:**
```
/onboard-service

Service: notification-service / Team: platform-team / Env: production
Image: registry.internal/notification-service:v1.0.0 / Port: 8080
Health: /health/ready, /health/live
Resource profile: small (100m CPU / 128Mi memory requests)
Calls: smtp-relay.infra:25, redis.cache:6379
Called by: order-service (namespace: production)
External: no
Required: namespace, ServiceAccount, RBAC, NetworkPolicy, Helm chart, ArgoCD app, HPA (min 2 max 8), ServiceMonitor
```

**RU:**
```
/onboard-service

Сервис: notification-service / Команда: platform-team / Окружение: production
Image: registry.internal/notification-service:v1.0.0 / Порт: 8080
Health: /health/ready, /health/live
Профиль ресурсов: small (100m CPU / 128Mi memory requests)
Вызывает: smtp-relay.infra:25, redis.cache:6379
Вызывается: order-service (namespace: production)
Внешний доступ: нет
Требуется: namespace, ServiceAccount, RBAC, NetworkPolicy, Helm chart, ArgoCD app, HPA (min 2 max 8), ServiceMonitor
```

---

## Example 2 — Externally exposed service with TLS

**EN:**
```
/onboard-service

Service: api-gateway / Team: backend-team / Env: staging
Image: registry.internal/api-gateway:v0.9.0 / Port: 8080
External: yes — NGINX Ingress at api.staging.example.com, TLS via cert-manager (Let's Encrypt)
Resource profile: medium (250m CPU / 256Mi memory)
Auth: mTLS between internal services
PDB: minAvailable 1 (staging has >= 2 replicas)
```

**RU:**
```
/onboard-service

Сервис: api-gateway / Команда: backend-team / Окружение: staging
Image: registry.internal/api-gateway:v0.9.0 / Порт: 8080
Внешний доступ: да — NGINX Ingress на api.staging.example.com, TLS через cert-manager (Let's Encrypt)
Профиль ресурсов: medium (250m CPU / 256Mi memory)
Auth: mTLS между внутренними сервисами
PDB: minAvailable 1 (в staging минимум 2 реплики)
```
