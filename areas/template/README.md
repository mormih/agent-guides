# Template Area Blueprint

Shablon dlya sozdaniya novykh oblastey v unifitsirovannom formate `areas/<area>/<specialization>/`.

## Tselevaya struktura

```text
areas/<area>/
  <specialization>/
    AGENTS.md
    rules/
    skills/
    workflows/
    prompts/
```

## Kak ispolzovat

1. Sozdayte direktoriyu oblasti: `areas/<area>/`.
2. Dobavte odnu ili neskolko spetsializatsiy (`backend`, `frontend`, `domain`, ...).
3. Dlya kazhdoy spetsializatsii zapolnite:
   - `AGENTS.md` (polnyy shablon instruktsii dlya generatsii itogovogo project `AGENTS.md`),
   - `rules/`,
   - `skills/`,
   - `workflows/`,
   - `prompts/`.
4. Proverte ustanovku cherez `agentos-install.sh`:

```bash
./agentos-install.sh install \
  --project-dir /tmp/demo \
  --agent-os default \
  --areas <area> \
  --specializations <area>.<specialization>
```

## Quality gate

- Minimum 3 pravila v `rules/`.
- Minimum 3 navyka v `skills/`.
- Minimum 3 workflow v `workflows/`.
- Minimum 3 prompt v `prompts/`.
- `AGENTS.md` spetsializatsii soderzhit Build/Test/Lint, coding style, security, architecture, testing.
