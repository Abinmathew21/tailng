import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const daybookClassicThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-daybook-classic',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f7f0bf',
      canvas: '#fff7c7',
      muted: '#eadf94',
      surface: '#fffbe4',
    },
    foreground: {
      primary: '#111827',
      secondary: '#26415c',
      muted: '#5f6b54',
      inverse: '#fff7cf',
    },
    border: {
      default: '#9b9761',
      subtle: '#d6cc7a',
      strong: '#174a78',
    },
    accent: {
      brand: '#104a7a',
      brandHover: '#07375d',
      danger: '#b42318',
      success: '#0f7b35',
      warning: '#b86800',
    },
    focus: {
      ring: '#0f8b8d',
    },
  }),
};
