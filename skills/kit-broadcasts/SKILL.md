---
name: kit-broadcasts
description: Use for Kit send and content workflows, including broadcasts, sequences, and email template lookup. Prefer supported commands like `kit broadcasts ...`, `kit sequences ...`, and `kit email-templates list`.
---

# Kit Broadcasts

Use this skill for broadcasts, sequences, templates, and send-status oriented tasks.

## Command pattern

```bash
if command -v kit >/dev/null 2>&1; then
  KIT_BIN=(kit)
else
  KIT_BIN=(npx @kit/cli)
fi
"${KIT_BIN[@]}" config show
"${KIT_BIN[@]}" account
```

For stateful work, prefer machine-readable output:

```bash
"${KIT_BIN[@]}" broadcasts list --json
"${KIT_BIN[@]}" sequences list --json
"${KIT_BIN[@]}" email-templates list --json
```

## Guidance

- Resolve names to IDs before follow-up commands.
- Prefer JSON when comparing draft, scheduled, sending, sent, or paused state.
- Use text output only for the final human summary.
- If a send or schedule action is requested, confirm the target object from structured output first.

## Safety

- Treat send-related actions as high impact.
- Use preview or dry-run behavior when the CLI supports it.
- Never rely on title matching alone when an ID is available.
