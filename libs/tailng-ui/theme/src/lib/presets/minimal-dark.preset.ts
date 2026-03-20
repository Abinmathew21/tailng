import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const minimalDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-minimal-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '{color.neutral900}',
      canvas: '{color.neutral900}',
      muted: '#1e293b',
      surface: '#1e293b',
    },
    foreground: {
      primary: '{color.white}',
      secondary: '{color.neutral300}',
      muted: '{color.neutral400}',
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#334155',
      subtle: '#334155',
      strong: '{color.neutral400}',
    },
    accent: {
      brand: '{color.white}',
      brandHover: '{color.neutral200}',
      danger: '#f87171',
      success: '#4ade80',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '{color.white}',
    },
  }),
};
