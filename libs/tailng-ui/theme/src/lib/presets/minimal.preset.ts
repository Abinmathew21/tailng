import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const minimalThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-minimal',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f1f3f6',
      canvas: '#e8edf3',
      muted: '#dce3eb',
      surface: '#f4f6f8',
    },
    foreground: {
      primary: '#111827',
      secondary: '{color.neutral500}',
      inverse: '{color.white}',
    },
    border: {
      default: '#c4ccd7',
      subtle: '#d3dae3',
      strong: '{color.neutral500}',
    },
    accent: {
      brand: '#111827',
      brandHover: '{color.neutral900}',
      danger: '{color.danger500}',
      success: '{color.success500}',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '#111827',
    },
  }),
};
