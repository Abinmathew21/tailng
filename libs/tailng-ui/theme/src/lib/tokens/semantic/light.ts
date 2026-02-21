import type { ThemeSemanticTokens } from '../../contracts/token.types';

export const lightSemanticTokens: ThemeSemanticTokens = {
  background: {
    base: '{color.white}',
    canvas: '{color.white}',
    muted: '{color.neutral100}',
    surface: '{color.neutral50}',
  },
  foreground: {
    primary: '{color.neutral900}',
    secondary: '{color.neutral500}',
    muted: '{color.neutral500}',
    inverse: '{color.white}',
  },
  border: {
    default: '{color.neutral100}',
    subtle: '{color.neutral100}',
    strong: '{color.neutral500}',
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
