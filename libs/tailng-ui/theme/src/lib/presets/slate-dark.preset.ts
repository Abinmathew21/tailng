import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const slateDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-slate-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#0f172a',
      canvas: '#0b1220',
      muted: '#1e293b',
      surface: '#111827',
    },
    foreground: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '#0f172a',
    },
    border: {
      default: '#334155',
      subtle: '#1f2937',
      strong: '#475569',
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
