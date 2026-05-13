import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const prismDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-prism-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#15122b',
      canvas: '#0e0b1f',
      muted: '#272044',
      surface: '#1b1634',
    },
    foreground: {
      primary: '#f3f4f6',
      secondary: '#d1d5db',
      muted: '#9ca3af',
      inverse: '#111827',
    },
    border: {
      default: '#3d315f',
      subtle: '#2b2349',
      strong: '#67578e',
    },
    accent: {
      brand: '#818cf8',
      brandHover: '#a5b4fc',
      danger: '#fca5a5',
      success: '#86efac',
      warning: '#fcd34d',
    },
    focus: {
      ring: '#818cf8',
    },
  }),
};
