import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

import { Theme } from './insight.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const REQUIRED_FIELDS = ['title', 'date'];
const RECOMMENDED_FIELDS: Record<Theme, string[]> = {
  [Theme.CHIRPY]: ['categories', 'tags', 'toc'],
  [Theme.MINIMA]: [],
  [Theme.MINIMAL_MISTAKES]: ['layout', 'excerpt'],
  [Theme.GENERIC]: [],
};

function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

export function validateFrontmatter(
  content: string,
  theme: Theme = Theme.GENERIC
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const block = extractFrontmatter(content);
  if (!block) return { valid: false, errors: ['Missing frontmatter block.'], warnings };
  let parsed: Record<string, unknown>;
  try {
    parsed = (parse(block) as Record<string, unknown>) ?? {};
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

export async function validateFrontmatterFromFile(
  filePath: string,
  theme: Theme = Theme.GENERIC
): Promise<ValidationResult> {
  const content = await readFile(filePath, 'utf8');
  return validateFrontmatter(content, theme);
}

async function main(): Promise<void> {
  const filePath = process.argv[2];
  const themeArg = process.argv[3] as Theme | undefined;
  if (!filePath) {
    console.error('Usage: node ./scripts/validate-frontmatter.js <post-file> [theme]');
    process.exit(1);
  }

  const theme = themeArg && Object.values(Theme).includes(themeArg) ? themeArg : Theme.GENERIC;
  const result = await validateFrontmatterFromFile(filePath, theme);
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  });
}
