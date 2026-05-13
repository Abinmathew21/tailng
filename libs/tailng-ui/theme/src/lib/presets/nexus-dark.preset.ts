import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const nexusDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-nexus-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#0b1530',
      canvas: '#050b1c',
      muted: '#14294d',
      surface: '#0f1e38',
    },
    foreground: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#244163',
      subtle: '#173153',
      strong: '#4a6d95',
    },
    accent: {
      brand: '#60a5fa',
      brandHover: '#93c5fd',
      danger: '#f87171',
      success: '#4ade80',
      warning: '#fbbf24',
    },
    focus: {
      ring: '#60a5fa',
    },
  }),
};
