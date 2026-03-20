import type { ThemeDefinition } from '../contracts/theme.types';
import { createThemeTokens } from '../tokens';
import { darkSemanticTokens } from '../tokens/semantic/dark';

export const defaultDarkThemePreset: ThemeDefinition = {
  meta: {
    name: 'tailng-default-dark',
    mode: 'dark',
  },
  tokens: createThemeTokens(darkSemanticTokens),
};
