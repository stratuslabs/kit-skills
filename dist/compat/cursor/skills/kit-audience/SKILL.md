---
name: kit-audience
description: Use for Kit audience workflows, including subscribers, tags, forms, custom fields, and segment lookup. Prefer supported commands like `kit subscribers ...`, `kit tags ...`, `kit forms ...`, `kit custom-fields ...`, and `kit segments list`.
---

# Kit Audience

Use this skill for audience data and subscriber management workflows.

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

Prefer JSON for operational work:

```bash
"${KIT_BIN[@]}" subscribers list --json
"${KIT_BIN[@]}" tags list --json
"${KIT_BIN[@]}" forms list --json
"${KIT_BIN[@]}" custom-fields list --json
"${KIT_BIN[@]}" segments list --json
```

## Guidance

- Use JSON when you need subscriber IDs, tag IDs, segment IDs, pagination cursors, or deterministic follow-up operations.
- Resolve names to IDs before write actions.
- For bulk work, fetch structured results once, then operate on the chosen subset.

## Safety

- Confirm config and account context before export or mutation flows.
- Be careful with destructive or large-scale audience changes. If intent is ambiguous, pause and ask.
