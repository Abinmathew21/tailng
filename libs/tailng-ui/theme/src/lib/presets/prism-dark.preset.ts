import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const prismDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-prism-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#0f172a',
      canvas: '#0b1020',
      muted: '#1f2937',
      surface: '#111827',
    },
    foreground: {
      primary: '#f3f4f6',
      secondary: '#d1d5db',
      muted: '#9ca3af',
      inverse: '#111827',
    },
    border: {
      default: '#374151',
      subtle: '#1f2937',
      strong: '#4b5563',
    },
    accent: {
      brand: '#818cf8',
      brandHover: '#a5b4fc',
      danger: '#fca5a5',
      success: '#86efac',
      warning: '#fcd34d',
    },
    focus: {
      ring: '#818cf8',
    },
  }),
};
