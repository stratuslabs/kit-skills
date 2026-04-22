---
name: kit-operations
description: Use for Kit operational tasks spanning purchases, webhooks, and bulk jobs. Handles bulk subscriber imports, bulk tagging, webhook management, and purchase data inspection. Requires kit-account for CLI bootstrap and auth.
---

# Kit Operations

Cross-domain operational work: purchases, webhooks, and bulk jobs. Requires kit-account for auth setup.

## Purchases

```bash
kit purchases list --json
kit purchases get <id> --json
```

Output shape:

```json
{
  "purchases": [
    {
      "id": 555,
      "transaction_id": "ch_abc123",
      "status": "paid",
      "email_address": "buyer@example.com",
      "currency": "USD",
      "transaction_time": "2026-03-15T14:30:00Z",
      "subtotal": 4900,
      "products": [{ "pid": 1, "lid": 0, "quantity": 1, "unit_price": 4900 }]
    }
  ]
}
```

`subtotal` is in cents. `status` values: `paid`, `refunded`.

## Webhooks

```bash
kit webhooks list --json
kit webhooks create --target-url "https://example.com/hook" --event "subscriber.subscriber_activate" --json
kit webhooks delete <id>
```

Webhook events include:
- `subscriber.subscriber_activate` — new confirmed subscriber
- `subscriber.subscriber_unsubscribe` — unsubscribe
- `subscriber.form_subscribe` — form submission
- `purchase.purchase_create` — new purchase
- `subscriber.tag_add` / `subscriber.tag_remove` — tag changes

## Bulk Operations

> ⚠️ Bulk endpoints require OAuth authentication. API keys will return 401.

```bash
kit bulk subscribers create --file ./subscribers.json
kit bulk tags add --file ./taggings.json
```

Subscriber import file format (JSON array):

```json
[
  { "email_address": "new@example.com", "first_name": "Alex" },
  { "email_address": "another@example.com", "first_name": "Jordan", "fields": { "company": "Acme" } }
]
```

Tagging file format:

```json
[
  { "subscriber_id": 12345, "tag_id": 42 },
  { "subscriber_id": 12346, "tag_id": 42 }
]
```

Bulk operations are async — the CLI returns a job ID. Check status with:

```bash
kit bulk status <job_id> --json
```

## Known Limitations

- No bulk unsubscribe via CLI — must process individually.
- Purchase data is read-only (no creating purchases via CLI).
- Webhook delivery failures are not visible through the CLI — check Kit's dashboard.
- Bulk jobs have rate limits. For large imports (>10k), split into batches.
