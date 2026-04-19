#!/usr/bin/env node

import { cp, lstat, mkdir, readlink, realpath, rm, symlink } from 'node:fs/promises';
import { homedir, platform } from 'node:os';
import path from 'node:path';

const SKILL_NAME = 'insight-capture';
const SKIP_ENV = 'INSIGHT_CAPTURE_NO_INSTALL';

function log(message) {
  console.log(`[insight-install] ${message}`);
}

function parseOnlyArg(args) {
  const arg = args.find((value) => value.startsWith('--only='));
  if (!arg) return undefined;
  const only = arg.split('=')[1];
  if (only === 'claude' || only === 'codex') return only;
  throw new Error(`Invalid --only value: ${only}`);
}

function resolvePackageRoot() {
  const currentFile = path.resolve(process.argv[1] ?? process.cwd());
  const dir = path.dirname(currentFile);
  return ['bin', 'src'].includes(path.basename(dir)) ? path.dirname(dir) : dir;
}

function getLocations(only) {
  const home = homedir();
  const all = [
    {
      target: 'claude',
      label: 'Claude Code',
      dirPath: path.join(home, '.claude', 'skills'),
      skillPath: path.join(home, '.claude', 'skills', SKILL_NAME),
    },
    {
      target: 'codex',
      label: 'Codex CLI',
      dirPath: path.join(home, '.agents', 'skills'),
      skillPath: path.join(home, '.agents', 'skills', SKILL_NAME),
    },
  ];
  return only ? all.filter((item) => item.target === only) : all;
}

async function exists(target) {
  try {
    await lstat(target);
    return true;
  } catch {
    return false;
  }
}

async function removeExisting(location, options) {
  if (!(await exists(location.skillPath))) return true;
  if (!options.force && !options.uninstall) {
    log(`WARN: ${location.skillPath} exists; pass --force to replace.`);
    return false;
  }
  if (options.dryRun) {
    log(`[dry-run] remove ${location.skillPath}`);
    return true;
  }
  await rm(location.skillPath, { recursive: true, force: true });
  return true;
}

async function installOne(sourceDir, location, options) {
  await mkdir(location.dirPath, { recursive: true });
  if (!(await removeExisting(location, options))) return;
  if (options.dryRun) {
    log(`[dry-run] install ${location.label} -> ${location.skillPath}`);
    return;
  }
  if (platform() === 'win32') {
    try {
      await symlink(sourceDir, location.skillPath, 'junction');
    } catch {
      await cp(sourceDir, location.skillPath, { recursive: true, force: true });
    }
    return;
  }
  await symlink(sourceDir, location.skillPath);
}

async function uninstallOne(sourceDir, location, options) {
  if (!(await exists(location.skillPath))) return;
  const stat = await lstat(location.skillPath);
  if (!stat.isSymbolicLink()) {
    log(`WARN: ${location.skillPath} is not a link; skipping.`);
    return;
  }
  const actual = await realpath(location.skillPath);
  const expected = await realpath(sourceDir);
  if (actual !== expected) {
    const raw = await readlink(location.skillPath).catch(() => 'unknown');
    log(`WARN: ${location.skillPath} points to ${raw}; skipping.`);
    return;
  }
  if (options.dryRun) {
    log(`[dry-run] uninstall ${location.skillPath}`);
    return;
  }
  await rm(location.skillPath, { force: true });
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    verbose: args.includes('--verbose'),
    uninstall: args.includes('--uninstall'),
    fromPostinstall: args.includes('--from-postinstall'),
    only: parseOnlyArg(args),
  };
  if (process.env[SKIP_ENV] === '1') {
    log(`${SKIP_ENV}=1 detected; skipping install.`);
    return;
  }
  if (options.fromPostinstall && process.env.npm_config_global !== 'true') {
    log('Local install detected; skipping automatic registration.');
    return;
  }
  const sourceDir = resolvePackageRoot();
  const locations = getLocations(options.only);
  for (const location of locations) {
    if (options.uninstall) await uninstallOne(sourceDir, location, options);
    else await installOne(sourceDir, location, options);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[insight-install] ERROR: ${message}`);
  process.exit(1);
});
