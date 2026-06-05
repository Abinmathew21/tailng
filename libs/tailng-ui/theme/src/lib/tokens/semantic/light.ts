import type { ThemeSemanticTokens } from '../../contracts/token.types';

export const lightSemanticTokens: ThemeSemanticTokens = {
  background: {
    base: '#eef4fb',
    canvas: '#e3edf8',
    muted: '#d4e2f2',
    surface: '#f3f8fd',
  },
  foreground: {
    primary: '#1f2937',
    secondary: '#4b5563',
    muted: '#6b7280',
    inverse: '#eef4fb',
  },
  border: {
    default: '#b8c7d9',
    subtle: '#cdd9e8',
    strong: '#7f92aa',
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
};
