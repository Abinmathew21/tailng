const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'tng-bg-canvas': 'var(--tng-semantic-background-canvas)',
        'tng-bg-surface': 'var(--tng-semantic-background-surface)',
        'tng-bg-base': 'var(--tng-semantic-background-base)',
        'tng-bg-muted': 'var(--tng-semantic-background-muted)',
        'tng-fg-primary': 'var(--tng-semantic-foreground-primary)',
        'tng-fg-secondary': 'var(--tng-semantic-foreground-secondary)',
        'tng-fg-muted': 'var(--tng-semantic-foreground-muted)',
        'tng-border-subtle': 'var(--tng-semantic-border-subtle)',
        'tng-border-strong': 'var(--tng-semantic-border-strong)',
        'tng-accent-brand': 'var(--tng-semantic-accent-brand)',
        'tng-accent-danger': 'var(--tng-semantic-accent-danger)',
        'tng-accent-success': 'var(--tng-semantic-accent-success)',
        'tng-fg-inverse': 'var(--tng-semantic-foreground-inverse)',
        'tng-focus-ring': 'var(--tng-semantic-focus-ring)',
      },
    },
  },
  plugins: [],
};
