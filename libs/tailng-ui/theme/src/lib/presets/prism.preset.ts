import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const prismThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-prism',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f1efff',
      canvas: '#e8e6ff',
      muted: '#dcd7ff',
      surface: '#f7f5ff',
    },
    foreground: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
      inverse: '{color.white}',
    },
    border: {
      default: '#c8c0ff',
      subtle: '#ded8ff',
      strong: '#8b80ef',
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
