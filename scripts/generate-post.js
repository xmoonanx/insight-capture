// src/generate-post.ts
import { stringify } from "yaml";

// src/insight.ts
import { z } from "zod";
var PostPattern = /* @__PURE__ */ ((PostPattern2) => {
  PostPattern2["PROBLEM_SOLUTION"] = "problem-solution";
  PostPattern2["LEARNING_NOTE"] = "learning-note";
  PostPattern2["TUTORIAL"] = "tutorial";
  PostPattern2["TIPS"] = "tips";
  return PostPattern2;
})(PostPattern || {});
var InsightSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  pattern: z.nativeEnum(PostPattern),
  summary: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  categories: z.array(z.string().min(1)).default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lang: z.enum(["ko", "en"]).default("ko"),
  slugSuggestion: z.string().optional()
});

// src/generate-post.ts
function kebab(input) {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
function generateSlug(title, suggestion) {
  const preferred = kebab(suggestion ?? "");
  if (preferred) return preferred;
  const fallback = kebab(title);
  return fallback || "insight-post";
}
function generateFrontmatter(insight, theme) {
  const frontmatter = { title: insight.title, date: insight.date };
  if (insight.description) frontmatter.description = insight.description;
  if (insight.categories.length) frontmatter.categories = insight.categories;
  if (insight.tags.length) frontmatter.tags = insight.tags;
  if (insight.lang && insight.lang !== "ko") frontmatter.lang = insight.lang;
  if (theme === "chirpy" /* CHIRPY */) {
    frontmatter.toc = true;
  }
  if (theme === "minimal-mistakes" /* MINIMAL_MISTAKES */) {
    frontmatter.layout = "single";
    frontmatter.excerpt = insight.description ?? insight.summary;
  }
  return frontmatter;
}
function generatePost(insight, theme) {
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
export {
  generateFrontmatter,
  generatePost,
  generateSlug
};
