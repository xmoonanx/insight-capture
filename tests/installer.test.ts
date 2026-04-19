import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, test } from 'vitest';

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('installer', () => {
  test('prints dry-run install target for claude', async () => {
    const { stdout } = await execFileAsync(
      'node',
      ['./bin/insight-install.js', '--dry-run', '--only=claude'],
      {
        cwd: projectRoot,
      }
    );
    expect(stdout).toContain('.claude/skills/insight-capture');
  });

  test('skips automatic registration for local postinstall', async () => {
    const { stdout } = await execFileAsync(
      'node',
      ['./bin/insight-install.js', '--from-postinstall'],
      {
        cwd: projectRoot,
      }
    );
    expect(stdout).toContain('Local install detected');
  });
});
