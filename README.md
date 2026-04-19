# Insight Capture

Insight Capture turns Claude Code or Codex CLI session learnings into
Jekyll-ready blog posts.

It is designed for developers who want to turn debugging notes, implementation
decisions, and learning logs into publishable Markdown without rebuilding the
structure by hand every time.

## Status

This package is currently `0.1.0-alpha.0`.

The core install, detection, validation, build, and packaging flows are working,
but the package should still be treated as an alpha release before broad usage.

## Features

- detect Jekyll themes from `_config.yml`
- generate front matter for Minima, Chirpy, Minimal Mistakes, or generic Jekyll
- validate generated front matter before saving
- install the skill into Claude Code and Codex CLI locations
- ship reference patterns and writing templates for technical posts

## Installation

Global install:

```bash
npm install -g @xmoonanx/insight-capture
```

Preview where the skill will be installed:

```bash
npx insight-install --dry-run
```

Install into one target only:

```bash
npx insight-install --dry-run --only=claude
npx insight-install --dry-run --only=codex
```

## Quick Start

1. Build the package locally if you are developing on it.
2. Run theme detection against a Jekyll project.
3. Validate a generated post before saving or publishing.

```bash
npm install
npm run build
node ./scripts/detect-theme.js ~/project/git_blog/xmoonanx.github.io
node ./scripts/validate-frontmatter.js ./examples/sample-post.md
```

Both helper commands print JSON to stdout and exit non-zero on failure.

## Commands

Detect the active Jekyll theme:

```bash
node ./scripts/detect-theme.js /path/to/site
```

Validate generated front matter:

```bash
node ./scripts/validate-frontmatter.js /path/to/post.md
```

Preview installer behavior:

```bash
node ./bin/insight-install.js --dry-run
```

## Layout

- `SKILL.md`: top-level skill contract
- `agents/openai.yaml`: Codex-facing metadata
- `references/`: Jekyll and theme rules used by the skill
- `assets/templates/`: writing examples for generated posts
- `src/`: TypeScript source of the package
- `scripts/`: built helper entrypoints
- `bin/`: installer entrypoint
- `examples/`: sample insight input and sample output post

## Supported Themes

- Minima
- Chirpy
- Minimal Mistakes
- Generic Jekyll

## Development

```bash
npm install
npm run lint
npm run test
npm run build
```

Package verification before publish:

```bash
npm pack --dry-run
```

## Documentation

- `docs/examples.md` for end-to-end command examples
- `references/jekyll-conventions.md` for front matter rules
- `references/supported-themes.md` for theme-specific behavior
- `references/post-patterns.md` for writing structure guidance

## License

MIT
