import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const minimalThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-minimal',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      canvas: '#f6f7f9',
      surface: '#fbfbfc',
    },
    foreground: {
      primary: '#111827',
      secondary: '{color.neutral500}',
      inverse: '{color.white}',
    },
    border: {
      subtle: '{color.neutral100}',
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
