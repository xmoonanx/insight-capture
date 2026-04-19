# Examples

## End-to-End Local Flow

```bash
npm install
npm run build
node ./scripts/detect-theme.js ~/project/git_blog/xmoonanx.github.io
node ./scripts/validate-frontmatter.js ./examples/sample-post.md
```

This is the fastest way to verify that the package is built, the helper CLIs are
working, and the generated front matter passes validation.

## Detect Theme

```bash
node ./scripts/detect-theme.js ~/project/git_blog/xmoonanx.github.io
```

Expected shape:

```json
{
  "theme": "chirpy",
  "configPath": "/path/to/_config.yml",
  "fields": {
    "theme": "jekyll-theme-chirpy"
  }
}
```

## Validate Front Matter

```bash
node ./scripts/validate-frontmatter.js ./examples/sample-post.md
```

Expected shape:

```json
{
  "valid": true,
  "errors": [],
  "warnings": []
}
```

## Installer Preview

```bash
npx insight-install --dry-run --only=claude
```

You can also preview Codex installation:

```bash
npx insight-install --dry-run --only=codex
```
