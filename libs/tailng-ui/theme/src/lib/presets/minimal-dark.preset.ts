import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const minimalDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-minimal-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#111827',
      canvas: '#0b111c',
      muted: '#1f2937',
      surface: '#151f2e',
    },
    foreground: {
      primary: '{color.white}',
      secondary: '{color.neutral300}',
      muted: '{color.neutral400}',
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#334155',
      subtle: '#273244',
      strong: '{color.neutral400}',
    },
    accent: {
      brand: '#dde3ec',
      brandHover: '#eaeff5',
      danger: '#f87171',
      success: '#4ade80',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '#dde3ec',
    },
  }),
};
