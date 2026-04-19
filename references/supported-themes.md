# Supported Themes

## Detection

Run `scripts/detect-theme.js <jekyll-project-root>` against the target Jekyll project.
It reads `_config.yml` and checks both `theme:` and `remote_theme:` keys.

## Theme reference

### minima

The default Jekyll theme. Minimal front matter required.

**`_config.yml` signatures:**
```yaml
theme: minima
# or
remote_theme: jekyll/minima
```

**Frontmatter extras:** none required.

---

### chirpy

Popular blog-focused theme with sidebar, TOC, and dark mode.

**`_config.yml` signatures:**
```yaml
remote_theme: cotes2020/jekyll-theme-chirpy
```

**Frontmatter extras:**
```yaml
categories: [Category, Subcategory]
tags: [tag1, tag2]
toc: true
```

Note: `toc_sticky` is NOT a Chirpy field — do not add it.

---

### minimal-mistakes

Feature-rich theme widely used for documentation and personal sites.

**`_config.yml` signatures:**
```yaml
remote_theme: mmistakes/minimal-mistakes
# or
theme: minimal-mistakes-jekyll
```

**Frontmatter extras:**
```yaml
layout: single
excerpt: "Short description."
toc: true
toc_sticky: true
```

---

### generic

Fallback when the theme cannot be determined from `_config.yml`.
Only `title` and `date` are output. The user can add theme-specific fields manually.
