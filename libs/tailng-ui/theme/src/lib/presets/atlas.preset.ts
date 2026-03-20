import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';

export const atlasThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-atlas',
    mode: 'light',
  },
  tokens: createThemeTokens({
    background: {
      base: '{color.white}',
      canvas: '#f6f7f9',
      muted: '#e5e7eb',
      surface: '{color.white}',
    },
    foreground: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#6b7280',
      inverse: '{color.white}',
    },
    border: {
      default: '#cbd5e1',
      subtle: '#e5e7eb',
      strong: '#94a3b8',
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
