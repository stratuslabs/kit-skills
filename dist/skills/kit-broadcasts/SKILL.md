---
name: kit-broadcasts
description: Use for Kit broadcast execution and content workflows, including broadcast lookup, draft review, sequence checks, email template resolution, scheduling context, and send-risk validation with supported `kit broadcasts`, `kit sequences`, and `kit email-templates` commands.
---

# Kit Broadcasts

Use this skill for high-stakes Kit messaging work: broadcasts, sequences, templates, send readiness, and status checks.

This is the most operator-sensitive Kit skill in the bundle. Treat it like production operations, not casual content browsing.

## Primary goals

1. Find the right broadcast, sequence, or template reliably.
2. Use structured output to resolve names to IDs before follow-up actions.
3. Separate content inspection from send-impacting actions.
4. Reduce the chance of sending, scheduling, or editing the wrong object.

## Bootstrap pattern

Always establish CLI availability and account context first.

```bash
if command -v kit >/dev/null 2>&1; then
  KIT_BIN=(kit)
else
  KIT_BIN=(npx @kit/cli)
fi
"${KIT_BIN[@]}" config show
"${KIT_BIN[@]}" account
```

If auth or account context is missing, stop before any mutation or scheduling work.

## Preferred inspection commands

For anything more than a quick glance, use JSON.

```bash
"${KIT_BIN[@]}" broadcasts list --json
"${KIT_BIN[@]}" sequences list --json
"${KIT_BIN[@]}" email-templates list --json
```

Use text output only for a brief human-facing summary after the operational work is done.

## When to use this skill

Use this skill when the task involves any of the following:

- locating a broadcast by title, state, or send window
- checking draft versus scheduled versus sent status
- matching a sequence or template to a broadcast workflow
- comparing candidate sends before making a recommendation
- verifying IDs and metadata before a high-impact action
- summarizing send state for an operator

## Working style

### 1. Resolve names to IDs first

Never rely on a title match alone if JSON output gives you a stable ID.

Preferred pattern:

1. list the candidate objects in JSON,
2. narrow by title, timestamps, or status,
3. confirm the intended object,
4. use the ID for any next step.

### 2. Read first, mutate second

Before any send-adjacent step, inspect the current state in structured output.

Good examples:

- check whether the broadcast is still a draft
- check whether it is already scheduled
- verify which template or sequence it belongs to
- confirm the exact object the human means

### 3. Keep summaries human, keep operations structured

A solid pattern is:

- machine-readable JSON for the lookup,
- concise human summary for the recommendation,
- explicit confirmation before any risky write.

## Recommended workflows

### Broadcast triage

Use this when a user asks things like “what is going out today?” or “which draft matches this campaign?”

```bash
"${KIT_BIN[@]}" broadcasts list --json
```

Then summarize only the fields needed for the decision, such as title, ID, state, and scheduled timing.

### Template resolution

When a workflow depends on finding a reusable template, prefer structured lookup first.

```bash
"${KIT_BIN[@]}" email-templates list --json
```

Resolve the template ID before connecting it to any further step.

### Sequence context

When a send might actually belong to an automation flow rather than a one-off broadcast, inspect sequences before guessing.

```bash
"${KIT_BIN[@]}" sequences list --json
```

## Decision rules

- If multiple broadcasts have similar names, do not guess.
- If the user requests a send or schedule action, confirm the exact object from JSON first.
- If the account context looks wrong, stop.
- If the requested action could reach subscribers, be explicit about what is known and what still needs confirmation.
- If a safe preview or dry-run mode exists in the local CLI version, prefer it.

## Safety checklist

Before any send-impacting action, confirm all of the following when the CLI surfaces them:

- correct account
- correct broadcast or sequence ID
- current object status
- intended audience or target object
- intended timing or schedule state

If any of those are ambiguous, pause and ask.

## Anti-patterns

Avoid these:

- relying on text-only output for branching logic
- assuming the newest title match is correct
- treating drafts and scheduled sends as interchangeable
- performing send-adjacent work without re-checking account context
- claiming an action is safe when the CLI state has not been inspected

## Example operator summary

After structured inspection, a useful summary might look like:

- Broadcast `Weekly Product Notes` appears to be a draft.
- Candidate ID: `br_12345`.
- Matching template: `tmpl_67890`.
- No confirmed send action taken.
- Next safe step: confirm this is the intended broadcast before scheduling or sending.

## Notes

- Prefer portable shell patterns.
- Prefer JSON for all multi-step workflows.
- Treat sends, schedules, and edits as high-impact operations.
- This skill intentionally avoids inventing unsupported Kit CLI behavior.
