# Prompt: `/ansible-config`

Use when: writing or debugging Ansible playbooks for server configuration, K8s node prep, or OS-level automation.

---

## Example 1 — Ansible role for K8s node prerequisites

**EN:**
```
/ansible-config

Task: write idempotent Ansible role for K8s node prerequisites
Target OS: Ubuntu 22.04 LTS
Role name: k8s-prereqs
Tasks to cover:
  - Disable swap (permanent, survives reboot: /etc/fstab edit)
  - Load kernel modules: overlay, br_netfilter (persistent via /etc/modules-load.d)
  - Set sysctl params: net.bridge.bridge-nf-call-iptables=1, net.ipv4.ip_forward=1
  - Install containerd (from official apt repo, pin version)
  - Configure containerd: SystemdCgroup=true, correct config.toml
  - Install kubeadm, kubelet, kubectl (pinned to 1.31.x; apt-mark hold)
  - Restart containerd handler (only on config change)
Testing: molecule test scenario with Ubuntu 22.04 container
```

**RU:**
```
/ansible-config

Задача: написать идемпотентную Ansible роль для K8s node prerequisites
Целевая ОС: Ubuntu 22.04 LTS
Название роли: k8s-prereqs
Задачи для покрытия:
  - Отключение swap (постоянно, переживает перезагрузку: редактирование /etc/fstab)
  - Загрузка kernel modules: overlay, br_netfilter (постоянно через /etc/modules-load.d)
  - Установка sysctl параметров: net.bridge.bridge-nf-call-iptables=1, net.ipv4.ip_forward=1
  - Установка containerd (из официального apt репозитория, с pinned версией)
  - Конфигурация containerd: SystemdCgroup=true, корректный config.toml
  - Установка kubeadm, kubelet, kubectl (pinned to 1.31.x; apt-mark hold)
  - Handler перезапуска containerd (только при изменении конфига)
Тестирование: molecule test сценарий с Ubuntu 22.04 контейнером
```

---

## Example 2 — Debug: playbook not idempotent (changed every run)

**EN:**
```
/ansible-config

Problem: playbook reports "changed" on every run for 3 tasks; should be idempotent
Playbook: playbooks/base-server.yml
Tasks reporting changed:
  1. "Configure sysctl" — uses raw `command: sysctl -w net.ipv4.ip_forward=1` (not idempotent)
  2. "Set timezone" — uses `command: timedatectl set-timezone UTC` (should use timezone module)
  3. "Add SSH key" — uses `lineinfile` but adds duplicate key on each run
Fix all three tasks to be idempotent; show before/after + explanation of why each was wrong
Run: ansible-playbook --check --diff to verify 0 changes on second run
```

**RU:**
```
/ansible-config

Проблема: playbook сообщает "changed" при каждом запуске для 3 задач; должен быть идемпотентным
Playbook: playbooks/base-server.yml
Задачи, сообщающие changed:
  1. "Configure sysctl" — использует raw `command: sysctl -w net.ipv4.ip_forward=1` (не идемпотентно)
  2. "Set timezone" — использует `command: timedatectl set-timezone UTC` (нужен timezone модуль)
  3. "Add SSH key" — использует `lineinfile` но добавляет дубликат ключа при каждом запуске
Исправить все три задачи для идемпотентности; показать до/после + объяснение почему каждая была неправильной
Запустить: ansible-playbook --check --diff для проверки 0 изменений при втором запуске
```
