# agent-guides

Unifitsirovannyy katalog spetsializatsiy AgentOS i ustanovshchik `agentos-install.sh`.

## Struktura repozitoriya

```text
areas/
  software/
    backend/
    frontend/
    data-engineering/
    full-stack/
    mlops/
    mobile/
    platform/
    qa/
    security/
extensions/
  opencode/
  codex/
  antigravity/
  gemini/
agentos-install.sh
```

Kazhdaya spetsializatsiya pod `areas/software/<specialization>/` khranit:
- `AGENTS.md` (shablon spetsializatsii)
- `rules/`
- `skills/`
- `workflows/`
- `prompts/`

## Chto delaet installer

1. Sozdaet tselevuyu direktoriyu proekta (esli ne sushchestvuet).
2. Kopiruet vybrannoe rasshirenie AgentOS iz `extensions/<agentos>` v `<project>/.<agentos>`.
3. Kopiruet vybrannye spetsializatsii v obshchiy sloy:
   - `<project>/.agent/rules`
   - `<project>/.agent/skills`
   - `<project>/.agent/workflows`
   - `<project>/.agent/prompts`
4. Generiruet itogovyy `<project>/AGENTS.md` na osnove shablonov vybrannykh spetsializatsiy.
5. Pechataet sgruppirovannyy otchet o sozdannykh/skopirovannykh putyakh.

## CLI rezhim

### Dostupnye sushchnosti

```bash
./agentos-install.sh list agentos
./agentos-install.sh list areas
./agentos-install.sh list specs --area software
```

### Ustanovka

```bash
./agentos-install.sh install \
  --project-dir /tmp/test \
  --agent-os opencode \
  --areas software \
  --specializations software.backend,software.frontend
```

Sukhoy progon:

```bash
./agentos-install.sh install \
  --project-dir /tmp/test \
  --agent-os codex \
  --areas software \
  --specializations software.frontend \
  --dry-run
```

## TUI rezhim

```bash
./agentos-install.sh tui
```

Poshagovo:
1. Vvod direktorii proekta.
2. Vybor AgentOS (`codex`, `antigravity`, `opencode`, `gemini`, ...).
3. Mnozhestvennyy vybor `areas` (seychas minimum `software`).
4. Dlya kazhdoy area — mnozhestvennyy vybor spetsializatsiy (`backend`, `frontend`, ...).

Pri starte TUI otobrazhaet ASCII-art.

## E2E testy

```bash
./tests/e2e/agentos-install.e2e.sh
```

Stsenarii:
- CLI: `opencode + software.backend`
- CLI: `codex + software.frontend`
- TUI: `default + software.backend,software.frontend`

