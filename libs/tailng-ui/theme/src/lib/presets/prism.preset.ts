import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const prismThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-prism',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f7f8fa',
      canvas: '#f7f8fc',
      muted: '#eef2ff',
      surface: '#fbfbfc',
    },
    foreground: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
      inverse: '{color.white}',
    },
    border: {
      default: '#d1d5db',
      subtle: '#e5e7eb',
      strong: '#9ca3af',
    },
    accent: {
      brand: '#4f46e5',
      brandHover: '#4338ca',
      danger: '{color.danger500}',
      success: '{color.success500}',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '#4f46e5',
    },
  }),
};
