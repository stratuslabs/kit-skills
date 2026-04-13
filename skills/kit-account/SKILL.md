---
name: kit-account
description: Use for Kit account-level tasks like login state checks, account inspection, logout/login flows, and safely preparing account-scoped operations with supported commands such as `kit config show` and `kit account`.
---

# Kit Account

Use this skill for login state, account context, and account-scoped setup.

## Before you act

1. Prefer `kit` if installed.
2. Fallback to `npx @kit/cli` when `kit` is unavailable.
3. Verify config and account context before any write or sensitive read.

```bash
if command -v kit >/dev/null 2>&1; then
  KIT_BIN=(kit)
else
  KIT_BIN=(npx @kit/cli)
fi
"${KIT_BIN[@]}" config show
"${KIT_BIN[@]}" account
```

Use supported auth commands when needed:

```bash
"${KIT_BIN[@]}" login
"${KIT_BIN[@]}" logout
```

## Use JSON when

- you need IDs or structured config fields,
- the result feeds another command,
- you need deterministic branching.

## Notes

- Do not invent auth-status commands.
- If config or account output shows auth is missing or unusable, stop before mutations.
- Prefer explicit IDs from structured output over name matching.
