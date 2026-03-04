# OpenCode setup

## Configuration

The main OpenCode configuration file is located at:

```text
~/.config/opencode/opencode.json
```

## Authentication

### Auth files

OpenCode stores authentication data in two locations:

| Path | Description |
|------|-------------|
| `~/.config/opencode/` | Plugin-level credentials (for example, `antigravity-accounts.json`) |
| `~/.local/share/opencode/auth.json` | Primary provider tokens (OpenAI, Google, and others) |

## Notes

- Back up credentials before machine migration.
- Keep auth files out of version control.
- Prefer least-privilege API keys for automation.
