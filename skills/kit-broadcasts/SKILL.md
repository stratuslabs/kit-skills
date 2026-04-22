---
name: kit-broadcasts
description: Use for Kit broadcast and email workflows — creating drafts, scheduling sends, checking stats, managing templates, and targeting subscribers. Handles Kit's HTML content format and subscriber filtering. Requires kit-account for CLI bootstrap and auth.
---

# Kit Broadcasts

Broadcast management, email templates, and send operations via the Kit CLI. Requires kit-account for auth setup.

## Broadcasts

```bash
"${KIT_BIN[@]}" broadcasts list --json
"${KIT_BIN[@]}" broadcasts get <id> --json
"${KIT_BIN[@]}" broadcasts stats <id> --json
```

List output shape:

```json
{
  "broadcasts": [
    {
      "id": 9876,
      "subject": "Weekly Update #12",
      "description": "Internal note",
      "content": "<p class=\"\">HTML content</p>",
      "public": false,
      "send_at": "2026-05-01T09:00:00-04:00",
      "published_at": null,
      "thumbnail_url": null,
      "email_template_id": 9,
      "subscriber_filter": []
    }
  ],
  "pagination": { "has_previous_page": false, "has_next_page": false, "start_cursor": "...", "end_cursor": "..." }
}
```

Determine broadcast status from fields:
- `send_at` null + `published_at` null → *draft*
- `send_at` set + future → *scheduled*
- `send_at` past → *sent*

Stats output includes: `recipients`, `open_rate`, `click_rate`, `emails_opened`, `total_clicks`, `unsubscribes`, `unsubscribe_rate`, `status`, `progress`.

## Creating & Scheduling

```bash
"${KIT_BIN[@]}" broadcasts create --subject "Subject" --content "<p class=\"\">Body</p>" --json
"${KIT_BIN[@]}" broadcasts create --subject "Subject" --content "<p class=\"\">Body</p>" --send-at "2026-05-01T09:00:00-04:00" --json
"${KIT_BIN[@]}" broadcasts update <id> --subject "New subject" --json
"${KIT_BIN[@]}" broadcasts delete <id>
```

- Omit `--send-at` to save as draft.
- `--send-at` takes ISO 8601 with timezone offset. Always confirm timezone.
- Sent broadcasts cannot be edited or rescheduled.

## Email Templates

```bash
"${KIT_BIN[@]}" email-templates list --json
```

Output:

```json
{
  "email_templates": [
    { "id": 9, "name": "Clean Layout", "is_default": true, "category": "HTML" }
  ]
}
```

Template rules:
- Only `"category": "HTML"` templates work with the API. "Starting point" templates are *not supported*.
- If no template is specified, Kit uses the account default.
- "Text Only" is usually cleanest for generated content.

## HTML Content Format

Kit's editor requires specific HTML to render as editable blocks. Read `references/html-format.md` for the full spec and markdown conversion table.

Key rules:
- Every block element needs `class=""`: `<p class="">`, `<h2 class="">`
- Lists: `<ul class="unordered_list">` with `<li class="list_item"><span>text</span></li>`
- No wrapping `<div>`. No `<br>` inside lists. No nested lists.
- Sending raw/unstyled HTML creates an uneditable "HTML block" instead of normal content.

## Subscriber Targeting

Target specific subscribers with `--subscriber-filter`. Read `references/subscriber-filter.md` for full syntax.

Quick example — send only to tag ID 42:

```bash
"${KIT_BIN[@]}" broadcasts create --subject "VIP Update" --content "..." \
  --subscriber-filter '[{"all":[{"type":"tag","ids":[42]}],"any":null,"none":null}]'
```

Supports `all` (AND), `any` (OR), `none` (NOT) with `type: "tag"` or `type: "segment"`. Only one group type per request.

## Sequences

```bash
"${KIT_BIN[@]}" sequences list --json
```

Check sequences when a send might belong to an automation flow rather than a one-off broadcast.

## Known Limitations

- No broadcast preview/render endpoint — you can't see the rendered output with template applied.
- `subscriber_filter` supports only one group type per request (all, any, or none — not combinations).
- No way to duplicate an existing broadcast via the CLI.
- Sent broadcasts are immutable.
