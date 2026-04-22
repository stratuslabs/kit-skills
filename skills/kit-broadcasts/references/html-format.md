# Kit Editor HTML Format

Kit's editor expects HTML in a specific format to render content as editable
text blocks. Sending raw HTML or unstyled elements creates an uneditable
"HTML block" instead of normal editable content.

## Element Reference

### Paragraphs
```html
<p class="">Your paragraph text here</p>
```

### Headings
```html
<h1 class="">Heading 1</h1>
<h2 class="">Heading 2</h2>
<h3 class="">Heading 3</h3>
```

### Unordered Lists
```html
<ul class="unordered_list">
  <li class="list_item"><span>First item</span></li>
  <li class="list_item"><span>Second item</span></li>
</ul>
```

### Ordered Lists
```html
<ol class="unordered_list">
  <li class="list_item"><span>Step one</span></li>
  <li class="list_item"><span>Step two</span></li>
</ol>
```

Note: ordered lists also use `class="unordered_list"` — this is Kit's convention.

### Horizontal Rule
```html
<hr/>
```

### Inline Formatting
```html
<strong>bold text</strong>
<em>italic text</em>
<a href="https://example.com">link text</a>
```

## Rules

1. Every block element MUST have `class=""` (even if empty string).
2. List items MUST wrap text in `<span>` tags.
3. No `<div>` wrapper around the content.
4. No `<br>` tags inside lists.
5. No nested lists (Kit editor doesn't support them).
6. Empty paragraphs: `<p class=""></p>` (for spacing).

## Markdown to Kit HTML Conversion

| Markdown | Kit HTML |
|----------|----------|
| `# Heading` | `<h1 class="">Heading</h1>` |
| `**bold**` | `<strong>bold</strong>` |
| `*italic*` | `<em>italic</em>` |
| `[text](url)` | `<a href="url">text</a>` |
| `- item` | `<ul class="unordered_list"><li class="list_item"><span>item</span></li></ul>` |
| `1. item` | `<ol class="unordered_list"><li class="list_item"><span>item</span></li></ol>` |
| `---` | `<hr/>` |
| plain text | `<p class="">text</p>` |

## Complete Example

Markdown:
```
# Weekly Update

Here's what happened this week.

## Highlights

- Launched the new feature
- Fixed three bugs
- Grew subscribers by 12%

Read more at [our blog](https://example.com).

---

Thanks for reading!
```

Kit HTML:
```html
<h1 class="">Weekly Update</h1>
<p class="">Here's what happened this week.</p>
<h2 class="">Highlights</h2>
<ul class="unordered_list">
  <li class="list_item"><span>Launched the new feature</span></li>
  <li class="list_item"><span>Fixed three bugs</span></li>
  <li class="list_item"><span>Grew subscribers by 12%</span></li>
</ul>
<p class="">Read more at <a href="https://example.com">our blog</a>.</p>
<hr/>
<p class="">Thanks for reading!</p>
```
