import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const sterlingThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-sterling',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '{color.white}',
      canvas: '#f8f8f7',
      muted: '{color.neutral100}',
      surface: '{color.white}',
    },
    foreground: {
      primary: '#1f2937',
      secondary: '#475569',
      muted: '#64748b',
      inverse: '{color.white}',
    },
    border: {
      default: '#cbd5e1',
      subtle: '#e2e8f0',
      strong: '#94a3b8',
    },
    accent: {
      brand: '#374151',
      brandHover: '#111827',
      danger: '{color.danger500}',
      success: '{color.success500}',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '#374151',
    },
  }),
};
