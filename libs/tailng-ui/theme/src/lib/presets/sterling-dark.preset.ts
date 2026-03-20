import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const sterlingDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-sterling-dark',
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
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#334155',
      subtle: '#1f2937',
      strong: '#64748b',
    },
    accent: {
      brand: '#cbd5e1',
      brandHover: '#e2e8f0',
      danger: '#fca5a5',
      success: '#86efac',
      warning: '#fcd34d',
    },
    focus: {
      ring: '#cbd5e1',
    },
  }),
};
