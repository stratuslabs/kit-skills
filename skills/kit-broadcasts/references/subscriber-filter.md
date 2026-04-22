# Subscriber Filtering for Broadcasts

Target specific subscribers when creating or updating a broadcast using
the `--subscriber-filter` flag or `subscriber_filter` field.

## Structure

```json
[
  {
    "all": [{ "type": "tag", "ids": [1, 2] }],
    "any": null,
    "none": null
  }
]
```

The filter is an array containing one filter group object. Each group has
three fields: `all`, `any`, `none`. Only one can be active per request.

## Filter Types

### `all` — Logical AND
Subscriber must match ALL provided tags/segments.

```json
{ "all": [{ "type": "tag", "ids": [10, 20] }], "any": null, "none": null }
```
Sends to subscribers who have BOTH tag 10 AND tag 20.

### `any` — Logical OR
Subscriber must match AT LEAST ONE provided tag/segment.

```json
{ "all": [], "any": [{ "type": "segment", "ids": [5, 6] }], "none": null }
```
Sends to subscribers in segment 5 OR segment 6.

### `none` — Logical NOT
Subscriber must NOT match any provided tags/segments.

```json
{ "all": [], "any": null, "none": [{ "type": "tag", "ids": [99] }] }
```
Sends to all subscribers EXCEPT those with tag 99.

## Mixing Tags and Segments

Within one group, you can include both types:

```json
{
  "all": [
    { "type": "tag", "ids": [10] },
    { "type": "segment", "ids": [5] }
  ],
  "any": null,
  "none": null
}
```
Sends to subscribers who have tag 10 AND are in segment 5.

## Limitations

- Only one filter group type per request. Cannot combine `all` + `none` in
  the same request.
- To send to everyone, omit `--subscriber-filter` entirely.
- Segment and tag IDs must be resolved before use. Use `kit tags list --json`
  and `kit segments list --json` to look up IDs by name.

## Common Patterns

Send to a single tag:
```json
[{ "all": [{ "type": "tag", "ids": [42] }], "any": null, "none": null }]
```

Send to everyone except a tag:
```json
[{ "all": [], "any": null, "none": [{ "type": "tag", "ids": [42] }] }]
```

Send to any of several segments:
```json
[{ "all": [], "any": [{ "type": "segment", "ids": [1, 2, 3] }], "none": null }]
```
