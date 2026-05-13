import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const sterlingThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-sterling',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f0f2f5',
      canvas: '#e7ebf0',
      muted: '#d9dee6',
      surface: '#f5f7fa',
    },
    foreground: {
      primary: '#1f2937',
      secondary: '#475569',
      muted: '#64748b',
      inverse: '{color.white}',
    },
    border: {
      default: '#b6bfca',
      subtle: '#d1d7df',
      strong: '#6b7280',
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
