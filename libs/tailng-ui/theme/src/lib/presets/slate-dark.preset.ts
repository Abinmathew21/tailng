import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const slateDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-slate-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#101826',
      canvas: '#0a111d',
      muted: '#1d2b3d',
      surface: '#152133',
    },
    foreground: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '#0f172a',
    },
    border: {
      default: '#314057',
      subtle: '#1f2a3a',
      strong: '#506175',
    },
    accent: {
      brand: '#94a3b8',
      brandHover: '#cbd5e1',
      danger: '#f87171',
      success: '#4ade80',
      warning: '#fbbf24',
    },
    focus: {
      ring: '#94a3b8',
    },
  }),
};
