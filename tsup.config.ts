import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'scripts/detect-theme': 'src/detect-theme.ts',
    'scripts/generate-post': 'src/generate-post.ts',
    'scripts/validate-frontmatter': 'src/validate-frontmatter.ts',
  },
  format: ['esm'],
  target: 'node20',
  splitting: false,
  clean: false,
  dts: false,
  sourcemap: false,
  outDir: '.',
});
