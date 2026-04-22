---
name: kit-account
description: Use for Kit account setup, auth verification, login/logout, and CLI bootstrap. All other Kit skills depend on this for auth context. Use before any Kit operation if auth state is unknown.
---

# Kit Account

Account context and auth for all Kit CLI operations. Other Kit skills depend on this.

## CLI Bootstrap

All Kit skills use this pattern. Establish it once per session.

```bash
if command -v kit >/dev/null 2>&1; then
  KIT_BIN=(kit)
else
  KIT_BIN=(npx @kit/cli)
fi
```

## Verify Auth

Before any Kit operation, confirm auth and account context:

```bash
"${KIT_BIN[@]}" config show
"${KIT_BIN[@]}" account
```

`account` returns:

```json
{
  "name": "Creator Name",
  "plan_name": "Creator Pro",
  "primary_email_address": "creator@example.com",
  "state": "active",
  "created_at": "2023-01-15T00:00:00Z"
}
```

If auth is missing or `state` is not `active`, stop before any mutations.

## Login / Logout

```bash
"${KIT_BIN[@]}" login
"${KIT_BIN[@]}" logout
```

`login` opens an OAuth flow. The CLI stores the token locally — subsequent commands use it automatically.

## Known Quirks

- API keys and OAuth tokens both work. OAuth is preferred for multi-tenant/App Store use.
- Token refresh is automatic in the CLI. If you get repeated 401s, `logout` then `login` again.
- `config show` reveals which auth method is active (API key vs OAuth).
