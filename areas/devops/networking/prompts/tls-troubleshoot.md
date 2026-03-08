# Prompt: `/tls-troubleshoot`

Use when: debugging TLS certificate issues — cert-manager failures, expired certs, HTTPS errors.

---

## Example 1 — cert-manager certificate stuck in Pending

**EN:**
```
/tls-troubleshoot

Tool: cert-manager / Issuer: letsencrypt-prod (ClusterIssuer)
Certificate: api-example-com-tls in namespace production
Status: kubectl get certificate → "False / Issuing" for > 10 min
Ingress host: api.example.com
Debug workflow:
  1. kubectl describe certificate api-example-com-tls -n production
  2. kubectl describe certificaterequest -n production (find matching CR)
  3. kubectl describe order -n production (ACME order status)
  4. kubectl describe challenge -n production (HTTP-01 or DNS-01 challenge status)
  5. Common failure modes:
     - HTTP-01: Ingress not serving /.well-known/acme-challenge/ (check ingress annotations)
     - HTTP-01: firewall blocking port 80 from Let's Encrypt IPs
     - DNS-01: wrong Route53 permissions or wrong hosted zone
     - Rate limit: too many failed attempts (check cert-manager logs)
```

**RU:**
```
/tls-troubleshoot

Инструмент: cert-manager / Issuer: letsencrypt-prod (ClusterIssuer)
Сертификат: api-example-com-tls в namespace production
Статус: kubectl get certificate → "False / Issuing" уже > 10 мин
Хост Ingress: api.example.com
Процесс отладки:
  1. kubectl describe certificate api-example-com-tls -n production
  2. kubectl describe certificaterequest -n production (найти соответствующий CR)
  3. kubectl describe order -n production (статус ACME order)
  4. kubectl describe challenge -n production (статус HTTP-01 или DNS-01 challenge)
  5. Типичные причины отказа:
     - HTTP-01: Ingress не обслуживает /.well-known/acme-challenge/ (проверить аннотации ingress)
     - HTTP-01: firewall блокирует порт 80 от IP Let's Encrypt
     - DNS-01: неверные права Route53 или неверный hosted zone
     - Rate limit: слишком много неудачных попыток (проверить логи cert-manager)
```

---

## Example 2 — Emergency: production certificate expires in 24h

**EN:**
```
/tls-troubleshoot

Alert: Certificate api.example.com expires in 18 hours (cert-manager failed to renew)
Current cert: expires 2024-11-16T10:00:00Z; cert-manager renewal window: 30 days before expiry
Problem: cert-manager tried to renew 30 days ago but ACME challenge failed; retries stopped
Immediate actions needed:
  1. Force renewal: kubectl annotate certificate api-example-com-tls -n production cert-manager.io/issue-once="true"
  2. Watch renewal: kubectl get certificate -w -n production
  3. If renewal fails: manually create certificate (cert-manager CLI or kubectl apply temp secret)
  4. Find and fix root cause of original renewal failure (DNS, HTTP-01, rate limit)
  5. Set up expiry alert: CertificateExpirationAlert firing at < 14 days
```

**RU:**
```
/tls-troubleshoot

Алерт: Сертификат api.example.com истекает через 18 часов (cert-manager не продлил)
Текущий сертификат: истекает 2024-11-16T10:00:00Z; окно продления cert-manager: за 30 дней до истечения
Проблема: cert-manager пытался продлить 30 дней назад но ACME challenge завершился неудачей; повторные попытки остановлены
Необходимые немедленные действия:
  1. Принудительное продление: kubectl annotate certificate api-example-com-tls -n production cert-manager.io/issue-once="true"
  2. Наблюдение за продлением: kubectl get certificate -w -n production
  3. Если продление не удалось: создать сертификат вручную (cert-manager CLI или kubectl apply temp secret)
  4. Найти и исправить корневую причину первоначального отказа (DNS, HTTP-01, rate limit)
  5. Настроить алерт на истечение: CertificateExpirationAlert при < 14 дней
```
