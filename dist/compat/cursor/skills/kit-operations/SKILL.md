---
name: kit-operations
description: Use for cross-domain Kit workflows and operational tasks that span purchases, webhooks, bulk jobs, and related inspection work. Prefer supported commands like `kit purchases ...`, `kit webhooks ...`, and `kit bulk ...`.
---

# Kit Operations

Use this skill for cross-domain operational work that does not fit cleanly into account, audience, or broadcasts.

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

Then prefer structured inspection commands when available:

```bash
"${KIT_BIN[@]}" purchases list --json
"${KIT_BIN[@]}" webhooks list --json
```

Use bulk commands only for explicit batch workflows, for example:

```bash
"${KIT_BIN[@]}" bulk subscribers create --file ./subscribers.json
"${KIT_BIN[@]}" bulk tags add --file ./taggings.json
```

## Guidance

- Use JSON whenever another step depends on IDs, statuses, timestamps, or batch results.
- Gather the minimum structured context once, then execute the next operation with explicit identifiers.
- Keep shell usage portable.

## Safety

- Verify config and account context before operational mutations.
- Prefer read-only inspection first when diagnosing a workflow.
- If a task spans multiple domains, report the plan briefly before any write step.
