import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const atlasDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-atlas-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#0b2628',
      canvas: '#041719',
      muted: '#11383a',
      surface: '#0d2d30',
    },
    foreground: {
      primary: '#e5e7eb',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '{color.neutral900}',
    },
    border: {
      default: '#235153',
      subtle: '#173d40',
      strong: '#4f8585',
    },
    accent: {
      brand: '#2dd4bf',
      brandHover: '#5eead4',
      danger: '#f87171',
      success: '#34d399',
      warning: '#fbbf24',
    },
    focus: {
      ring: '#2dd4bf',
    },
  }),
};
