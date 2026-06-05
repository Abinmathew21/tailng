import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const atlasThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-atlas',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '#edf8f6',
      canvas: '#dff2ef',
      muted: '#cce6e1',
      surface: '#f3fbf9',
    },
    foreground: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#6b7280',
      inverse: '#edfaf8',
    },
    border: {
      default: '#9ccac2',
      subtle: '#c0ddd8',
      strong: '#2d9a8f',
    },
    accent: {
      brand: '#0f766e',
      brandHover: '#115e59',
      danger: '{color.danger500}',
      success: '{color.success500}',
      warning: '{color.warning500}',
    },
    focus: {
      ring: '#0f766e',
    },
  }),
};
