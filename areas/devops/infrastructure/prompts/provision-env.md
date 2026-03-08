# Prompt: `/provision-env`

Use when: provisioning a new infrastructure environment with Terraform and Ansible.

---

## Example 1 — Full staging environment on Hetzner

**EN:**
```
/provision-env

Environment: staging / Cloud: Hetzner Cloud
Scope: all (network + compute + K8s-ready node config)
Resources:
  - Private network: 10.0.0.0/16
  - 1× cx31 control plane + 3× cx21 workers (Ubuntu 22.04)
  - Load balancer for K8s API (port 6443)
  - Firewall: deny-all inbound; allow SSH from jump-host IP only
IaC: Terraform for cloud resources, Ansible for OS config (K8s prereqs, containerd, kubeadm)
Outputs: server IPs to SSM; Ansible inventory file
Cost estimate: required in plan output
```

**RU:**
```
/provision-env

Окружение: staging / Облако: Hetzner Cloud
Скоуп: всё (сеть + вычисления + конфигурация нод для K8s)
Ресурсы:
  - Приватная сеть: 10.0.0.0/16
  - 1× cx31 control plane + 3× cx21 workers (Ubuntu 22.04)
  - Load balancer для K8s API (порт 6443)
  - Firewall: deny-all входящий; разрешить SSH только с IP jump-host
IaC: Terraform для облачных ресурсов, Ansible для конфига ОС
Выходные данные: IP серверов в SSM; inventory файл для Ansible
Оценка стоимости: обязательна в выводе plan
```

---

## Example 2 — Scale-out: add worker nodes (bare-metal)

**EN:**
```
/provision-env

Environment: production / Cloud: bare-metal
Scope: compute only (network already exists)
New servers: [worker-07..09: 192.168.10.27-29]
Tasks:
  - Ansible: OS prep, containerd, kubeadm install (same role as existing workers)
  - Output: kubeadm join command pre-staged
  - NOT in scope: actual cluster join (→ /cluster-bootstrap handles K8s level)
```

**RU:**
```
/provision-env

Окружение: production / Облако: bare-metal
Скоуп: только compute (сеть уже существует)
Новые серверы: [worker-07..09: 192.168.10.27-29]
Задачи:
  - Ansible: подготовка ОС, containerd, установка kubeadm (та же роль что у существующих workers)
  - Вывод: команда kubeadm join заготовлена заранее
  - Вне скоупа: фактическое подключение к кластеру (→ /cluster-bootstrap для K8s уровня)
```
