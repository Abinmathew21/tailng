import {
  createTheme,
  defaultDarkThemePreset,
  defaultThemePreset,
  type ThemeDefinition,
} from '@tailng-ui/theme';

export const acmeDashboardLightTheme: ThemeDefinition = createTheme(defaultThemePreset, {
  meta: {
    name: 'acme-dashboard',
    mode: 'light',
  },
  tokens: {
    semantic: {
      background: {
        surface: '#f6fffb',
      },
      accent: {
        brand: '#0f766e',
        brandHover: '#115e59',
      },
      focus: {
        ring: '#0f766e',
      },
    },
  },
});

export const acmeDashboardDarkTheme: ThemeDefinition = createTheme(defaultDarkThemePreset, {
  meta: {
    name: 'acme-dashboard-dark',
    mode: 'dark',
  },
  tokens: {
    semantic: {
      accent: {
        brand: '#2dd4bf',
        brandHover: '#14b8a6',
      },
      focus: {
        ring: '#2dd4bf',
      },
    },
  },
});
