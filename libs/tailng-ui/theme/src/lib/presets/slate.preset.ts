import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const slateThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-slate',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#edf2f7',
      canvas: '#e2e8f0',
      muted: '#d4dde8',
      surface: '#f1f5f9',
    },
    foreground: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#6b7280',
      inverse: '#f1f5f9',
    },
    border: {
      default: '#b6c2d1',
      subtle: '#cbd5e1',
      strong: '#7f8ea3',
    },
    accent: {
      brand: '#334155',
      brandHover: '#1e293b',
      danger: '{color.danger500}',
      success: '{color.success500}',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '#334155',
    },
  }),
};
