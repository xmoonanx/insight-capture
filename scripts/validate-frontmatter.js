// src/validate-frontmatter.ts
import { readFile } from "fs/promises";
import { parse } from "yaml";

// src/insight.ts
import { z } from "zod";
var Theme = /* @__PURE__ */ ((Theme2) => {
  Theme2["MINIMA"] = "minima";
  Theme2["CHIRPY"] = "chirpy";
  Theme2["MINIMAL_MISTAKES"] = "minimal-mistakes";
  Theme2["GENERIC"] = "generic";
  return Theme2;
})(Theme || {});
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

// src/validate-frontmatter.ts
var REQUIRED_FIELDS = ["title", "date"];
var RECOMMENDED_FIELDS = {
  ["chirpy" /* CHIRPY */]: ["categories", "tags", "toc"],
  ["minima" /* MINIMA */]: [],
  ["minimal-mistakes" /* MINIMAL_MISTAKES */]: ["layout", "excerpt"],
  ["generic" /* GENERIC */]: []
};
function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}
function validateFrontmatter(content, theme = "generic" /* GENERIC */) {
  const errors = [];
  const warnings = [];
  const block = extractFrontmatter(content);
  if (!block) return { valid: false, errors: ["Missing frontmatter block."], warnings };
  let parsed;
  try {
    parsed = parse(block) ?? {};
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { valid: false, errors: [`Invalid YAML: ${message}`], warnings };
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) errors.push(`Missing required field: ${field}`);
  }
  for (const field of RECOMMENDED_FIELDS[theme]) {
    if (!(field in parsed)) warnings.push(`Missing recommended field for ${theme}: ${field}`);
  }
  return { valid: errors.length === 0, errors, warnings };
}
async function validateFrontmatterFromFile(filePath, theme = "generic" /* GENERIC */) {
  const content = await readFile(filePath, "utf8");
  return validateFrontmatter(content, theme);
}
async function main() {
  const filePath = process.argv[2];
  const themeArg = process.argv[3];
  if (!filePath) {
    console.error("Usage: node ./scripts/validate-frontmatter.js <post-file> [theme]");
    process.exit(1);
  }
  const theme = themeArg && Object.values(Theme).includes(themeArg) ? themeArg : "generic" /* GENERIC */;
  const result = await validateFrontmatterFromFile(filePath, theme);
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) {
    process.exit(1);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  });
}
export {
  validateFrontmatter,
  validateFrontmatterFromFile
};
