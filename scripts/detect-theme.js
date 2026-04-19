// src/detect-theme.ts
import { readFile } from "fs/promises";
import path from "path";
import { parse } from "yaml";

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

// src/detect-theme.ts
var THEME_MAP = {
  minima: "minima" /* MINIMA */,
  "jekyll/minima": "minima" /* MINIMA */,
  "jekyll-theme-chirpy": "chirpy" /* CHIRPY */,
  "cotes2020/jekyll-theme-chirpy": "chirpy" /* CHIRPY */,
  "minimal-mistakes-jekyll": "minimal-mistakes" /* MINIMAL_MISTAKES */,
  "mmistakes/minimal-mistakes": "minimal-mistakes" /* MINIMAL_MISTAKES */
};
function normalizeThemeName(value) {
  if (typeof value !== "string") return void 0;
  const normalized = value.trim().toLowerCase();
  return normalized || void 0;
}
async function detectTheme(projectRoot) {
  const configPath = path.join(projectRoot, "_config.yml");
  const raw = await readFile(configPath, "utf8");
  const parsed = parse(raw);
  const theme = normalizeThemeName(parsed?.theme);
  const remoteTheme = normalizeThemeName(parsed?.remote_theme);
  const resolved = theme ?? remoteTheme;
  return {
    theme: resolved ? THEME_MAP[resolved] ?? "generic" /* GENERIC */ : "generic" /* GENERIC */,
    configPath,
    fields: { theme, remoteTheme }
  };
}
async function main() {
  const projectRoot = process.argv[2];
  if (!projectRoot) {
    console.error("Usage: node ./scripts/detect-theme.js <project-root>");
    process.exit(1);
  }
  const result = await detectTheme(projectRoot);
  console.log(JSON.stringify(result, null, 2));
}
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  });
}
export {
  detectTheme
};
