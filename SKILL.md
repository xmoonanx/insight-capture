---
name: insight-capture
description: |
  Capture development insights from coding sessions and convert them into
  Jekyll-compatible blog posts. Use this skill whenever the user says things
  like "이 이슈 블로그에 정리해줘", "오늘 배운 거 포스트로 만들어줘", "버그 해결 과정
  기록해줘", "write this up as a blog post", "turn this into a technical article",
  or any request to document a debugging session, learning, or workflow as a post.
  Works in Korean and English. If the user is wrapping up a coding session and
  mentions wanting to share it or save it for later, proactively offer this skill.
---

# Insight Capture

Convert a coding session, debugging story, or learning note into a polished
Jekyll blog post. The goal is a post that future-you (or a reader) can follow
without access to the original context.

## Triggers

Use this skill when the user says something like:

- "이 이슈 블로그에 정리해줘"
- "오늘 배운 거 포스트로 만들어줘"
- "버그 해결 과정 기록해줘"
- "이거 나중에 찾아볼 수 있게 정리해줘"
- "write this up as a blog post"
- "turn this session into a technical article"
- "document this fix"

## Workflow

### 1. Extract the Insight

Read the coding context from the conversation — recent messages, error logs, code
snippets, and anything the user shared. Identify:

- **The core event**: what happened? (bug, concept learned, process followed)
- **Title candidates**: 2–3 options, concise and specific
- **Tags**: lowercase kebab-case, 2–5 terms
- **Categories**: 1–2 levels (e.g. `["Engineering", "CI"]`)
- **One-line summary**: for the `description`/`excerpt` frontmatter field
- **Language**: `ko` if the user wrote in Korean, `en` otherwise

If the user provides a Jekyll project path, note it for theme detection and post placement.

### 2. Choose a Post Pattern

Pick based on the nature of the insight, not the user's phrasing.

| Pattern | Use when |
|---|---|
| `problem-solution` | A specific bug/error was found and fixed |
| `learning-note` | A concept or tool was understood |
| `tutorial` | A repeatable multi-step process |
| `tips` | A short, practical piece of advice |

Reference: `references/post-patterns.md` — read it for section structure of each pattern.

### 3. Detect the Jekyll Theme

If the user provided a Jekyll project path, run:

```bash
node ./scripts/detect-theme.js <project-root>
```

This reads `_config.yml` and returns the detected theme as JSON. Supported themes:
`chirpy`, `minima`, `minimal-mistakes`, `generic`.

If no project path was given, default to `generic` and mention it in the report.

Reference: `references/supported-themes.md`

### 4. Generate Front Matter

Produce the YAML front matter block. Required fields for all themes: `title`, `date`.

Use today's date unless the user specifies otherwise. Add theme-specific fields:

- **chirpy**: `categories`, `tags`, `toc: true` (no `toc_sticky`)
- **minimal-mistakes**: `layout: single`, `excerpt`, `toc: true`, `toc_sticky: true`
- **minima / generic**: only what's needed

For English posts, add `lang: en`. For Korean (`ko`), omit the `lang` field (default).

Reference: `references/jekyll-conventions.md`

### 5. Generate the Post Body

Use the pattern template from `assets/templates/<pattern>.md` as the structural guide.
Fill in the actual content from the session — don't pad or invent facts.

Good post body principles:
- Write for a reader who wasn't in the session
- Be specific: include the actual error message, the exact line that changed, the command that worked
- Keep it concise — a 200-word post that's precise beats a 600-word post that's vague
- If writing in Korean, write the body in Korean; front matter stays in English/YAML

### 6. Build the Slug

Slug must be ASCII-only. If the title is in Korean or contains non-ASCII characters,
ask the user for an English slug or derive one from the topic (e.g., "jekyll-chirpy-toc-fix").

File path format: `_posts/YYYY-MM-DD-<slug>.md`

### 7. Validate and Report

If a project path was given, run:

```bash
node ./scripts/validate-frontmatter.js <post-file> <theme>
```

Report back:
- Destination path (e.g. `_posts/2026-04-19-chirpy-toc-fix.md`)
- Theme detected
- Any validation errors or warnings
- A brief summary of what was generated (pattern, language, word count)

## Guardrails

- Do not invent facts that were not present in the session
- Do not overwrite an existing post file unless the user explicitly asks
- Slug must be ASCII — never use Korean or non-Latin characters in the filename
- Keep front matter minimal and theme-aware — don't add fields the theme doesn't use
- If the user's Jekyll project path is not provided, generate the post content only and
  tell the user where to save it
