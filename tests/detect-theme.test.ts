import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

import { detectTheme } from '../src/detect-theme.js';
import { Theme } from '../src/insight.js';

const dirs: string[] = [];

afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function makeProject(config: string): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'insight-capture-'));
  dirs.push(dir);
  await writeFile(path.join(dir, '_config.yml'), config, 'utf8');
  return dir;
}

describe('detectTheme', () => {
  test('detects chirpy from remote_theme', async () => {
    const root = await makeProject(`remote_theme: cotes2020/jekyll-theme-chirpy
`);
    const result = await detectTheme(root);
    expect(result.theme).toBe(Theme.CHIRPY);
  });

  test('falls back to generic for unknown theme', async () => {
    const root = await makeProject(`theme: custom-theme
`);
    const result = await detectTheme(root);
    expect(result.theme).toBe(Theme.GENERIC);
  });
});
