# Kit AI Toolkit

A standalone toolkit repo for distributing installable Kit skills across multiple coding agents.

It is intentionally separate from any production app or internal agent runtime. The goal is to keep `skills/` as the source of truth, then expose those skills through thin client manifests for Claude, Cursor, and Codex style consumers.

## What is in this repo

- `skills/` - shared skill definitions
- `.claude-plugin/plugin.json` - Claude-oriented manifest
- `.cursor-plugin/plugin.json` - Cursor-oriented manifest
- `.codex-plugin/plugin.json` - Codex-oriented manifest
- `assets/kit_glyph.svg` - lightweight shared icon
- `reference/cli-patterns.md` - small usage reference for command patterns

## CLI usage

This toolkit is aligned to the current `@kit/cli` surface from `imjohnbo/kit-cli`.

Prefer `kit` when installed:

```bash
kit --help
```

Fallback when `kit` is not installed globally:

```bash
npx @kit/cli --help
```

Skills in this repo are written so another agent can:

1. verify auth and account context with supported commands like `kit config show` and `kit account`,
2. prefer machine-readable JSON for multi-step workflows,
3. use plain text output for quick human summaries.

## Suggested distribution story

At a high level:

1. publish or package this repo as the portable skill bundle,
2. keep the shared instructions in `skills/`,
3. let each client manifest point at those shared skill folders,
4. rely on `@kit/cli` for the actual operational behavior.

That keeps agent-specific integration thin while the domain guidance stays centralized.

## Covered command families

The shared skills map to real command groups, including:

- `kit login`, `kit logout`, `kit account`, `kit config show`
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

The skill split stays account / audience / broadcasts / operations, but the examples only use supported commands.

## Assumptions

- Exact flags and response fields may evolve, so the skills focus on real command families and practical usage patterns.
- Manifest formats here are intentionally lightweight and repo-local. They are scaffold files for downstream client integration, not a claim of final vendor-specific packaging semantics.
