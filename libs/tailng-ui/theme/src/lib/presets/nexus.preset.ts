import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const nexusThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-nexus',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '{color.white}',
      canvas: '#f4f8ff',
      muted: '#e8eefc',
      surface: '#f8faff',
    },
    foreground: {
      primary: '{color.neutral900}',
      secondary: '#334155',
      muted: '{color.neutral500}',
      inverse: '{color.white}',
    },
    border: {
      default: '#c7d2fe',
      subtle: '#dbeafe',
      strong: '#93c5fd',
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
