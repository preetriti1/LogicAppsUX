import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/e2e-tests/*.test.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vscode'],
  keepNames: true,
});
