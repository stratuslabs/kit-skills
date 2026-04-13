# CLI patterns

Prefer `kit` when it is available:

```bash
kit --help
```

Fallback:

```bash
npx @kit/cli --help
```

Suggested shell helper in agent runs:

```bash
if command -v kit >/dev/null 2>&1; then
  KIT_BIN=(kit)
else
  KIT_BIN=(npx @kit/cli)
fi
"${KIT_BIN[@]}" --help
```

Verify auth and account context with supported commands:

```bash
"${KIT_BIN[@]}" config show
"${KIT_BIN[@]}" account
```

Prefer JSON whenever the next step depends on IDs, statuses, pagination cursors, or structured fields.

Use the real command families in this repo:

- `subscribers`
- `tags`
- `forms`
- `sequences`
- `broadcasts`
- `custom-fields`
- `purchases`
- `webhooks`
- `segments list`
- `email-templates list`
- `bulk`
