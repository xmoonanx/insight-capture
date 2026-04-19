# Jekyll Front Matter Conventions

## Required fields (all themes)

| Field   | Format                        | Example                    |
|---------|-------------------------------|----------------------------|
| `title` | String                        | `"Fix: Chirpy build error"` |
| `date`  | `YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS +TZ` | `2026-04-19` |

## Recommended fields by theme

### minima

No extra fields required. Optional: `categories`, `tags`.

### chirpy

```yaml
categories: [DevOps, CI]   # 1–2 levels, array form
tags: [github-actions, build]
toc: true                  # enables table of contents
```

- `categories`: up to 2 levels. First is broad (e.g. "Engineering"), second is specific.
- `tags`: lowercase kebab-case preferred.
- Do NOT add `toc_sticky` — that's a Minimal Mistakes field, not Chirpy.

### minimal-mistakes

```yaml
layout: single
excerpt: "One-sentence description shown in listings and social previews."
toc: true
toc_sticky: true           # keeps TOC visible while scrolling
```

- `layout: single` is required for posts.
- `excerpt` is used in list pages and SEO. If not set, Jekyll uses the first paragraph.

### generic

Only `title` and `date` are required. Add optional fields conservatively.

## Slug and filename rules

- Filename format: `_posts/YYYY-MM-DD-slug.md`
- Slug must be ASCII-only, lowercase, hyphenated.
- For Korean titles, always provide a `slugSuggestion` in English/ASCII. Without it the filename falls back to `insight-post`.

## Date handling

- Use the session date unless the user specifies another.
- Jekyll ignores posts dated in the future by default (unless `future: true` in `_config.yml`).
