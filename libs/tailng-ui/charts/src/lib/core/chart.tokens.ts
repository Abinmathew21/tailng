import type { TngChartResolvedTheme } from './chart-theme.types';

export const TNG_CHART_SOURCE_DATUM_KEY = '__tngDatum';

export const TNG_CHART_DEFAULT_THEME: TngChartResolvedTheme = {
  backgroundColor: '#ffffff',
  borderColor: '#d1d5db',
  dangerColor: '#dc2626',
  foregroundColor: '#111827',
  infoColor: '#0ea5e9',
  mutedColor: '#6b7280',
  palette: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6'],
  primaryColor: '#2563eb',
  successColor: '#10b981',
  surfaceColor: '#ffffff',
  warningColor: '#f59e0b',
};

export const TNG_CHART_CSS_VARIABLES = {
  background: ['--color-bg', '--tng-semantic-background-base', '--tng-semantic-background-canvas'],
  border: ['--color-border', '--tng-semantic-border-default', '--tng-semantic-border-subtle'],
  danger: ['--color-danger', '--tng-semantic-accent-danger'],
  foreground: ['--color-fg', '--tng-semantic-foreground-primary'],
  info: ['--color-info', '--tng-color-sky500', '--tng-color-cyan500'],
  muted: ['--color-muted', '--tng-semantic-foreground-muted', '--tng-semantic-foreground-secondary'],
  primary: ['--color-primary', '--tng-semantic-accent-brand', '--tng-color-primary500'],
  success: ['--color-success', '--tng-semantic-accent-success'],
  surface: ['--color-surface', '--tng-semantic-background-surface'],
  warning: ['--color-warning', '--tng-semantic-accent-warning'],
} as const;
