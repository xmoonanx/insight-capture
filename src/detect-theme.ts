import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

import { Theme } from './insight.js';

export interface DetectResult {
  theme: Theme;
  configPath: string;
  fields: { theme?: string; remoteTheme?: string };
}

const THEME_MAP: Record<string, Theme> = {
  minima: Theme.MINIMA,
  'jekyll/minima': Theme.MINIMA,
  'jekyll-theme-chirpy': Theme.CHIRPY,
  'cotes2020/jekyll-theme-chirpy': Theme.CHIRPY,
  'minimal-mistakes-jekyll': Theme.MINIMAL_MISTAKES,
  'mmistakes/minimal-mistakes': Theme.MINIMAL_MISTAKES,
};

function normalizeThemeName(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  return normalized || undefined;
}

export async function detectTheme(projectRoot: string): Promise<DetectResult> {
  const configPath = path.join(projectRoot, '_config.yml');
  const raw = await readFile(configPath, 'utf8');
  const parsed = parse(raw) as Record<string, unknown> | null;
  const theme = normalizeThemeName(parsed?.theme);
  const remoteTheme = normalizeThemeName(parsed?.remote_theme);
  const resolved = theme ?? remoteTheme;
  return {
    theme: resolved ? (THEME_MAP[resolved] ?? Theme.GENERIC) : Theme.GENERIC,
    configPath,
    fields: { theme, remoteTheme },
  };
}

async function main(): Promise<void> {
  const projectRoot = process.argv[2];
  if (!projectRoot) {
    console.error('Usage: node ./scripts/detect-theme.js <project-root>');
    process.exit(1);
  }

  const result = await detectTheme(projectRoot);
  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  });
}
