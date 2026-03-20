import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const atlasDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-atlas-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#0f172a',
      canvas: '#081315',
      muted: '#1f2937',
      surface: '#111827',
    },
    foreground: {
      primary: '#e5e7eb',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#334155',
      subtle: '#1f2937',
      strong: '#475569',
    },
    accent: {
      brand: '#2dd4bf',
      brandHover: '#5eead4',
      danger: '#f87171',
      success: '#34d399',
      warning: '#fbbf24',
    },
    focus: {
      ring: '#2dd4bf',
    },
  }),
};
