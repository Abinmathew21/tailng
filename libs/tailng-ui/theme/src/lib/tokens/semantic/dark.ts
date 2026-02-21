import type { ThemeSemanticTokens } from '../../contracts/token.types';

export const darkSemanticTokens: ThemeSemanticTokens = {
  background: {
    base: '#1e293b',
    canvas: '{color.neutral900}',
    muted: '#334155',
    surface: '#1e293b',
  },
  foreground: {
    primary: '{color.white}',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    inverse: '{color.neutral900}',
  },
  border: {
    default: '#94a3b8',
    subtle: '#334155',
    strong: '#94a3b8',
  },
  accent: {
    brand: '#60a5fa',
    brandHover: '#3b82f6',
    danger: '#f87171',
    success: '#4ade80',
    warning: '#f59e0b',
  },
  focus: {
    ring: '#60a5fa',
  },
};
