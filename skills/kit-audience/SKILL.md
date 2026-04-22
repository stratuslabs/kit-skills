---
name: kit-audience
description: Use for Kit subscriber management, tags, forms, custom fields, and segments. Handles subscriber lookup, tagging, bulk operations, and audience filtering. Requires kit-account for CLI bootstrap and auth.
---

# Kit Audience

Subscriber and audience management via the Kit CLI. Requires kit-account for auth setup.

## Subscribers

```bash
kit subscribers list --json
kit subscribers get <id> --json
```

List output shape:

```json
{
  "subscribers": [
    {
      "id": 12345,
      "email_address": "reader@example.com",
      "first_name": "Alex",
      "state": "active",
      "created_at": "2024-06-01T12:00:00Z",
      "fields": { "last_name": "Smith", "company": "Acme" }
    }
  ],
  "pagination": { "has_previous_page": false, "has_next_page": true, "start_cursor": "...", "end_cursor": "..." }
}
```

Subscriber states: `active`, `inactive`, `cancelled`, `bounced`, `complained`.

## Tags

```bash
kit tags list --json
kit tags add <subscriber_id> <tag_id>
kit tags remove <subscriber_id> <tag_id>
```

Tags output:

```json
{
  "tags": [
    { "id": 42, "name": "VIP", "created_at": "2024-01-01T00:00:00Z" }
  ]
}
```

Always resolve tag names to IDs before write operations — names are not unique identifiers.

## Forms & Landing Pages

```bash
kit forms list --json
```

Returns forms and landing pages together. Distinguish by `type` field (`embed`, `hosted`, `modal`).

## Custom Fields

```bash
kit custom-fields list --json
```

Custom field values are per-subscriber in the `fields` object. Field keys are lowercase with underscores.

## Segments

```bash
kit segments list --json
```

Returns segment `id` and `name`. Use segment IDs for broadcast targeting (see kit-broadcasts).

## Known Limitations

- *No endpoint to list subscribers within a segment.* You can list segments but cannot enumerate their members via the CLI.
- Pagination uses cursor-based `start_cursor`/`end_cursor`, not page numbers.
- Bulk subscriber operations use `kit bulk subscribers create --file ./subscribers.json` (see kit-operations). Bulk ops require OAuth auth.
- Subscriber search is by email address only — no full-text name search.
