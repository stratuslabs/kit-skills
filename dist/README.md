# Kit AI Toolkit

Installable Kit skills for coding agents, with `skills/` kept as the source of truth.

This repo now focuses on one thing: shipping a real, practical v1 that can be installed safely today.

## What this repo supports

### Supported directly

- **Codex global install** to `~/.codex/skills/<skill-name>/SKILL.md`
- **Codex project-local install** to `./.codex/skills/<skill-name>/SKILL.md`
- **Generated compatibility bundles** for Claude and Cursor style consumers

### Not claimed by this repo

- Native Claude auto-install semantics
- Native Cursor auto-install semantics
- Marketplace or plugin-store packaging

For Claude and Cursor, this repo generates clearly labeled compatibility artifacts for manual wiring or downstream tooling. That is intentional.

## Repository layout

- `skills/` - source-of-truth skill content
- `scripts/` - validation, build, and install scripts
- `dist/` - generated compatibility output
- `assets/` - shared branding assets
- `reference/` - small CLI references and notes

## Skills included

- `kit-account`
- `kit-audience`
- `kit-broadcasts` (primary polished v1 skill)
- `kit-operations`

## Install

### 1. Clone the repo

```bash
git clone git@github.com:stratuslabs/kit-skills.git
cd kit-skills
```

### 2. Validate the source skills

```bash
npm run validate
```

### 3. Choose an install target

#### Codex, global install

Installs each skill into `~/.codex/skills/<skill-name>/`.

```bash
npm run install:codex
```

#### Codex, project-local install

Installs into `./.codex/skills/<skill-name>/` for the current repo.

```bash
npm run install:codex:project
```

#### Compatibility bundle, project-local

Creates a labeled manual-use bundle in `./.kit-skills/compat/`.

```bash
npm run install:compat
```

#### Custom install destination

Useful when you want to sync a compatibility bundle into another location.

```bash
node ./scripts/install-skills.mjs --target compat-dir --dest ~/tmp/kit-skills-export
```

Or install Codex skills into a custom Codex-like directory:

```bash
node ./scripts/install-skills.mjs --target codex-global --dest ~/.codex/skills
```

## Build compatibility output

`dist/` is generated. Rebuild it whenever skill content changes.

```bash
npm run build
```

This creates:

- `dist/skills/` - bundled source-of-truth skills
- `dist/compat/codex/manifest.json`
- `dist/compat/claude/manifest.json`
- `dist/compat/cursor/manifest.json`

Each compatibility bundle includes copied skill files plus a manifest that explains what it is and what it is not.

## Validation rules

`npm run validate` checks that each skill:

- lives in its own directory under `skills/`
- contains `SKILL.md`
- includes frontmatter
- includes `name` and `description`
- matches the directory name
- has a non-empty body with a top-level heading

## Development workflow

```bash
npm run validate
npm run build
```

If you want a clean rebuild:

```bash
npm run clean && npm run build
```

## Kit CLI usage assumptions

These skills are written against practical, supported Kit CLI command families, including:

- `kit config show`
- `kit account`
- `kit login`, `kit logout`
- `kit subscribers ...`
- `kit tags ...`
- `kit forms ...`
- `kit sequences ...`
- `kit broadcasts ...`
- `kit custom-fields ...`
- `kit purchases ...`
- `kit webhooks ...`
- `kit segments list`
- `kit email-templates list`
- `kit bulk ...`

The repo avoids inventing unsupported client or vendor packaging semantics.

## Scope and limitations

- `skills/` stays the canonical source of truth.
- Generated bundles are compatibility artifacts, not magical installs.
- Codex is the only target this repo installs into directly by default.
- Claude and Cursor outputs are explicit, labeled exports until exact supported install flows are confirmed.
- Send or mutation workflows should still be confirmed in-context before execution.

## Why `kit-broadcasts` is the primary v1 skill

Broadcast work is the highest-risk and most operator-sensitive area in Kit. It benefits the most from structured guidance around drafts, templates, sequences, IDs, status checks, and send safety. So v1 puts the most polish there first.
