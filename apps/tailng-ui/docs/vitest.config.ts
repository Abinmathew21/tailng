/// <reference types="vitest" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    angular({
      tsconfig: resolve(projectRoot, '../../../tsconfig.base.json'),
    }),
    tsconfigPaths(),
  ],
  root: projectRoot,
  resolve: {
    alias: [
      { find: '@tailng-ui/cdk/core', replacement: resolve(projectRoot, '../../../libs/tailng-ui/cdk/src/core/index.ts') },
      { find: '@tailng-ui/cdk/overlay', replacement: resolve(projectRoot, '../../../libs/tailng-ui/cdk/src/overlay/index.ts') },
      { find: '@tailng-ui/cdk', replacement: resolve(projectRoot, '../../../libs/tailng-ui/cdk/src/index.ts') },
      { find: '@tailng-ui/components', replacement: resolve(projectRoot, '../../../libs/tailng-ui/components/src/index.ts') },
      { find: '@tailng-ui/primitives', replacement: resolve(projectRoot, '../../../libs/tailng-ui/primitives/src/index.ts') },
      { find: '@tailng-ui/registry', replacement: resolve(projectRoot, '../../../libs/tailng-ui/registry/src/index.ts') },
    ],
  },
  test: {
    name: 'docs',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: [resolve(projectRoot, './src/test-setup.ts')],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/apps/tailng-ui/docs',
      reporter: ['text', 'lcov'],
    },
  },
});
