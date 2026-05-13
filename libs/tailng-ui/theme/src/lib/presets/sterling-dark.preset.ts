import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const sterlingDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-sterling-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#111827',
      canvas: '#090f18',
      muted: '#1f2937',
      surface: '#171f2b',
    },
    foreground: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#3b4556',
      subtle: '#263140',
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
