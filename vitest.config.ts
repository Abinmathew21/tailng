// vitest.config.ts (at the ROOT)
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    angular({
      // Point this to your actual base tsconfig or tsconfig.base.json
      tsconfig: resolve(__dirname, 'tsconfig.base.json'),
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: [
      {
        find: '@tailng-ui/primitives',
        replacement: resolve(__dirname, 'libs/tailng-ui/primitives/src/index.ts'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'src/test-setup.ts')],
    // Important: Ensure Vitest picks up files in libs/
    include: ['libs/**/*.{test,spec}.ts', 'apps/**/*.{test,spec}.ts'],
    // Add this to prevent Vitest from hanging on large monorepos
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**'],
  },
});
