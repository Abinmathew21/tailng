import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const daybookClassicDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-daybook-classic-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens({
    background: {
      base: '#071e36',
      canvas: '#031326',
      muted: '#123858',
      surface: '#0a2a47',
    },
    foreground: {
      primary: '#f8f2cf',
      secondary: '#d9d2a3',
      muted: '#a8b59e',
      inverse: '#031326',
    },
    border: {
      default: '#2d5879',
      subtle: '#173754',
      strong: '#6aa0c4',
    },
    accent: {
      brand: '#7db8e8',
      brandHover: '#a8d0f0',
      danger: '#ff7a66',
      success: '#6bd17c',
      warning: '#ffb84d',
    },
    focus: {
      ring: '#38d0cf',
    },
  }),
};
