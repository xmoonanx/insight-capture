import { stringify } from 'yaml';

import { type Insight, Theme } from './insight.js';

export interface GenerateResult {
  filepath: string;
  content: string;
  slug: string;
  frontmatter: Record<string, unknown>;
}

function kebab(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateSlug(title: string, suggestion?: string): string {
  const preferred = kebab(suggestion ?? '');
  if (preferred) return preferred;
  const fallback = kebab(title);
  return fallback || 'insight-post';
}

export function generateFrontmatter(insight: Insight, theme: Theme): Record<string, unknown> {
  const frontmatter: Record<string, unknown> = { title: insight.title, date: insight.date };
  if (insight.description) frontmatter.description = insight.description;
  if (insight.categories.length) frontmatter.categories = insight.categories;
  if (insight.tags.length) frontmatter.tags = insight.tags;
  if (insight.lang && insight.lang !== 'ko') frontmatter.lang = insight.lang;
  if (theme === Theme.CHIRPY) {
    frontmatter.toc = true;
  }
  if (theme === Theme.MINIMAL_MISTAKES) {
    frontmatter.layout = 'single';
    frontmatter.excerpt = insight.description ?? insight.summary;
  }
  return frontmatter;
}

export function generatePost(insight: Insight, theme: Theme): GenerateResult {
  const slug = generateSlug(insight.title, insight.slugSuggestion);
  const filepath = `_posts/${insight.date}-${slug}.md`;
  const frontmatter = generateFrontmatter(insight, theme);
  const content = `---
${stringify(frontmatter).trimEnd()}
---

${insight.body.trim()}
`;
  return { filepath, content, slug, frontmatter };
}
