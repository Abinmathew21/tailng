/// <reference types="vitest" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: projectRoot,
  resolve: {
    alias: [
      { find: '@tailng-ui/cdk/core', replacement: resolve(projectRoot, '../cdk/src/core/index.ts') },
      {
        find: '@tailng-ui/cdk/overlay',
        replacement: resolve(projectRoot, '../cdk/src/overlay/index.ts'),
      },
      { find: '@tailng-ui/cdk', replacement: resolve(projectRoot, '../cdk/src/index.ts') },
      { find: '@tailng-ui/primitives', replacement: resolve(projectRoot, '../primitives/src/index.ts') },
    ],
  },
  test: {
    name: 'components',
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/components',
      reporter: ['text', 'lcov'],
    },
  },
});
