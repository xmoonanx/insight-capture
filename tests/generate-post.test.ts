import { describe, expect, test } from 'vitest';

import { generatePost } from '../src/generate-post.js';
import { PostPattern, Theme } from '../src/insight.js';

const base = {
  id: '1',
  title: 'Fixing a flaky build',
  pattern: PostPattern.PROBLEM_SOLUTION,
  summary: 'Why the build failed intermittently.',
  body: '## Problem\n\nBuilds were flaky.',
  tags: ['ci', 'build'],
  categories: ['Engineering', 'CI'],
  date: '2026-04-19',
  lang: 'en' as const,
};

describe('generatePost', () => {
  test('creates chirpy post output', () => {
    const result = generatePost(base, Theme.CHIRPY);
    expect(result.filepath).toBe('_posts/2026-04-19-fixing-a-flaky-build.md');
    expect(result.content).toContain('toc: true');
    expect(result.content).not.toContain('toc_sticky');
    expect(result.content).toContain('Builds were flaky.');
  });

  test('creates minimal-mistakes post with layout and excerpt', () => {
    const result = generatePost(base, Theme.MINIMAL_MISTAKES);
    expect(result.content).toContain('layout: single');
    expect(result.content).toContain('excerpt:');
  });

  test('strips non-ASCII characters from slug', () => {
    const result = generatePost({ ...base, title: '버그 수정 가이드' }, Theme.GENERIC);
    expect(result.slug).toBe('insight-post');
    expect(result.filepath).toMatch(/^_posts\/\d{4}-\d{2}-\d{2}-insight-post\.md$/);
  });

  test('prefers slugSuggestion over title for slug', () => {
    const result = generatePost({ ...base, slugSuggestion: 'my-custom-slug' }, Theme.GENERIC);
    expect(result.slug).toBe('my-custom-slug');
  });

  test('includes lang field for non-Korean posts', () => {
    const result = generatePost({ ...base, lang: 'en' }, Theme.GENERIC);
    expect(result.content).toContain('lang: en');
  });

  test('omits lang field for Korean posts', () => {
    const result = generatePost({ ...base, lang: 'ko' }, Theme.GENERIC);
    expect(result.content).not.toContain('lang:');
  });
});
