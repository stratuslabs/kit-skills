# Kit AI Toolkit

Give your AI tools access to the Kit platform.

The Kit AI Toolkit connects your coding agent to Kit's email marketing features — broadcasts, subscribers, tags, automations, and more. Write newsletters, manage your audience, and automate your creator workflow without leaving your editor.

## Install

### Claude Code

```bash
/plugin install stratuslabs/kit-skills
```

### Codex

In the Codex CLI, run `/plugins`, search for **Kit**, and select **Add to Codex**.

Or install manually:

```bash
git clone git@github.com:stratuslabs/kit-skills.git
cd kit-skills
npm run install:codex
```

### Cursor

Coming soon. For now, install manually:

```bash
git clone git@github.com:stratuslabs/kit-skills.git
cd kit-skills
npm run install:compat
```

## What's Included

- **Broadcasts** — Create drafts, schedule sends, check stats, manage email templates, and target specific subscriber segments
- **Audience** — Look up subscribers, manage tags, inspect forms, work with custom fields and segments
- **Account** — Verify auth, check account status, manage login sessions
- **Operations** — Bulk imports, webhook management, purchase data

## Skills

| Skill | What it does |
|-------|-------------|
| `kit-account` | Auth, login/logout, account context |
| `kit-audience` | Subscribers, tags, forms, custom fields, segments |
| `kit-broadcasts` | Drafts, scheduling, stats, templates, subscriber targeting |
| `kit-operations` | Purchases, webhooks, bulk imports |

## Requirements

- A [Kit](https://kit.com) account with API access
- The Kit CLI (`kit`) — [installation guide](https://kit.com/developers/cli)

## Contributing

We're not accepting pull requests at this time. If you find an issue, please [open an issue](https://github.com/stratuslabs/kit-skills/issues).

---

<details>
<summary>Development</summary>

### Repository layout

- `skills/` — skill content (source of truth)
- `scripts/` — validation and install scripts

### Validate skills

```bash
npm run validate
```

### Install targets

```bash
npm run install:codex           # global: ~/.codex/skills/
npm run install:codex:project   # project: ./.codex/skills/
npm run install:compat          # compatibility bundle: ./.kit-skills/compat/
```

</details>
