import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const nexusThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-nexus',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#eef5ff',
      canvas: '#e0ecff',
      muted: '#cadcff',
      surface: '#f3f7ff',
    },
    foreground: {
      primary: '{color.neutral900}',
      secondary: '#334155',
      muted: '{color.neutral500}',
      inverse: '{color.white}',
    },
    border: {
      default: '#9ebcff',
      subtle: '#bfd2ff',
      strong: '#5b8def',
    },
    accent: {
      brand: '{color.primary500}',
      brandHover: '{color.primary600}',
      danger: '{color.danger500}',
      success: '{color.success500}',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '{color.primary500}',
    },
  }),
};
