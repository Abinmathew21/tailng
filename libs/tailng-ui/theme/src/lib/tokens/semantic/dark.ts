import type { ThemeSemanticTokens } from '../../contracts/token.types';

export const darkSemanticTokens: ThemeSemanticTokens = {
  background: {
    base: '#1e293b',
    canvas: '#0f172a',
    muted: '#334155',
    surface: '#334155',
  },
  foreground: {
    primary: '{color.white}',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    inverse: '{color.neutral900}',
  },
  border: {
    default: '#475569',
    subtle: '#475569',
    strong: '#64748b',
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
