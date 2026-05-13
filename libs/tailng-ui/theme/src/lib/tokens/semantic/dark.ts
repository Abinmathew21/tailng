import type { ThemeSemanticTokens } from '../../contracts/token.types';

export const darkSemanticTokens: ThemeSemanticTokens = {
  background: {
    base: '#172033',
    canvas: '#0b1020',
    muted: '#26344d',
    surface: '#1f2a3d',
  },
  foreground: {
    primary: '{color.white}',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    inverse: '{color.neutral900}',
  },
  border: {
    default: '#3d4c63',
    subtle: '#2a364a',
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
