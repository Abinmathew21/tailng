import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const slateThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-slate',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f7f8fa',
      canvas: '#f5f7fb',
      muted: '#eef2f7',
      surface: '#f8fafc',
    },
    foreground: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#6b7280',
      inverse: '{color.white}',
    },
    border: {
      default: '#cbd5e1',
      subtle: '#e2e8f0',
      strong: '#94a3b8',
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
