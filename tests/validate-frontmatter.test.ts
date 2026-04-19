import { describe, expect, test } from 'vitest';

import { Theme } from '../src/insight.js';
import { validateFrontmatter } from '../src/validate-frontmatter.js';

describe('validateFrontmatter', () => {
  test('accepts valid post content', () => {
    const result = validateFrontmatter(
      `---
title: Example
date: 2026-04-19
---

Hello`,
      Theme.MINIMA
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('reports missing required fields', () => {
    const result = validateFrontmatter(
      `---
title: Example
---

Hello`,
      Theme.CHIRPY
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('date');
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
