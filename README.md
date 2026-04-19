# Insight Capture

Insight Capture turns Claude Code or Codex CLI session learnings into Jekyll-ready blog posts.

## Features

- detect Jekyll themes from `_config.yml`
- generate front matter for Minima, Chirpy, Minimal Mistakes, or generic Jekyll
- validate generated front matter before saving
- install the skill into Claude Code and Codex CLI locations

## Installation

```bash
npm install -g @xmoonanx/insight-capture
```

Manual install preview:

```bash
npx insight-install --dry-run
```

## Commands

```bash
node ./scripts/detect-theme.js /path/to/site
node ./scripts/validate-frontmatter.js /path/to/post.md
```

Both commands print JSON to stdout and exit non-zero on failure.

## Layout

- `SKILL.md`: top-level skill contract
- `agents/openai.yaml`: Codex metadata
- `references/`: Jekyll and theme rules
- `assets/templates/`: writing examples
- `src/`: TypeScript source
- `scripts/`: built CLI helpers
- `bin/`: installer

## Development

```bash
npm install
npm run lint
npm run test
npm run build
```

## Supported Themes

- Minima
- Chirpy
- Minimal Mistakes
- Generic Jekyll

## License

MIT
