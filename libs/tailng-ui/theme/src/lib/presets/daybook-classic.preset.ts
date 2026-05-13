import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const daybookClassicThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-daybook-classic',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#f4e79f',
      canvas: '#fff2ae',
      muted: '#e1d174',
      surface: '#f8eda5',
    },
    foreground: {
      primary: '#111827',
      secondary: '#26415c',
      muted: '#5f6b54',
      inverse: '#fff7cf',
    },
    border: {
      default: '#9b8e43',
      subtle: '#c9ba62',
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
