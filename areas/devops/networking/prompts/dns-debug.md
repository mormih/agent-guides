# Prompt: `/dns-debug`

Use when: debugging DNS resolution failures in Kubernetes — service discovery, external DNS, CoreDNS issues.

---

## Example 1 — Service DNS not resolving in K8s pod

**EN:**
```
/dns-debug

Symptom: pod in namespace "production" cannot resolve "redis.cache.svc.cluster.local"
Error: "dial tcp: lookup redis.cache.svc.cluster.local: no such host"
Cluster DNS: CoreDNS (kube-dns service at 10.96.0.10)
Debug steps needed:
  1. Verify Service exists: kubectl get svc redis -n cache
  2. Check pod DNS config: kubectl exec <pod> -- cat /etc/resolv.conf
  3. Test DNS from pod: kubectl exec <pod> -- nslookup redis.cache.svc.cluster.local
  4. Check CoreDNS logs: kubectl logs -n kube-system -l k8s-app=kube-dns
  5. Check NetworkPolicy: is UDP 53 to kube-dns blocked from production namespace?
  6. Cilium-specific: check if DNS proxy is intercepting/blocking the query
```

**RU:**
```
/dns-debug

Симптом: под в namespace "production" не может разрешить "redis.cache.svc.cluster.local"
Ошибка: "dial tcp: lookup redis.cache.svc.cluster.local: no such host"
Кластерный DNS: CoreDNS (сервис kube-dns на 10.96.0.10)
Необходимые шаги отладки:
  1. Убедиться что Service существует: kubectl get svc redis -n cache
  2. Проверить DNS конфиг пода: kubectl exec <pod> -- cat /etc/resolv.conf
  3. Тест DNS из пода: kubectl exec <pod> -- nslookup redis.cache.svc.cluster.local
  4. Проверить логи CoreDNS: kubectl logs -n kube-system -l k8s-app=kube-dns
  5. Проверить NetworkPolicy: заблокирован ли UDP 53 на kube-dns из namespace production?
  6. Cilium-специфично: проверить не перехватывает ли DNS proxy запрос
```

---

## Example 2 — External DNS not creating records for Ingress

**EN:**
```
/dns-debug

Setup: ExternalDNS controller (AWS Route53 provider)
Symptom: new Ingress created (api.example.com), but Route53 A record never appears
ExternalDNS pod: Running, no obvious errors in kubectl logs
Ingress: has annotation kubernetes.io/ingress.class: nginx; MetalLB assigned external IP
Debug:
  1. Check ExternalDNS logs for the specific hostname
  2. Verify IngressClass annotation matches ExternalDNS --source filter
  3. Check ExternalDNS IRSA role has Route53 ChangeResourceRecordSets permission
  4. Verify hosted zone ID in ExternalDNS deployment matches Route53 zone
  5. Check if Ingress has status.loadBalancer.ingress populated (required for ExternalDNS)
```

**RU:**
```
/dns-debug

Конфигурация: ExternalDNS контроллер (провайдер AWS Route53)
Симптом: создан новый Ingress (api.example.com), но A запись Route53 так и не появилась
Под ExternalDNS: Running, очевидных ошибок в kubectl logs нет
Ingress: имеет аннотацию kubernetes.io/ingress.class: nginx; MetalLB назначил внешний IP
Отладка:
  1. Проверить логи ExternalDNS для конкретного hostname
  2. Убедиться что аннотация IngressClass совпадает с фильтром --source ExternalDNS
  3. Проверить что IRSA роль ExternalDNS имеет разрешение Route53 ChangeResourceRecordSets
  4. Убедиться что hosted zone ID в deployment ExternalDNS совпадает с зоной Route53
  5. Проверить заполнен ли status.loadBalancer.ingress у Ingress (требуется для ExternalDNS)
```
