import type { ThemeSemanticTokens } from '../../contracts/token.types';

export const lightSemanticTokens: ThemeSemanticTokens = {
  background: {
    base: '#f7f8fa',
    canvas: '#f3f4f6',
    muted: '#e9edf2',
    surface: '#fbfbfc',
  },
  foreground: {
    primary: '#1f2937',
    secondary: '#4b5563',
    muted: '#6b7280',
    inverse: '{color.white}',
  },
  border: {
    default: '#d1d5db',
    subtle: '#e5e7eb',
    strong: '#9ca3af',
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
