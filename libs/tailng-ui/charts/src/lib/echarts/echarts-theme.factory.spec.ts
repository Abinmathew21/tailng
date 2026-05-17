import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveTngEchartsTheme } from './echarts-theme.factory';
import { TNG_CHART_DEFAULT_THEME } from '../core/chart.tokens';

describe('resolveTngEchartsTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads TailNG CSS variables with fallbacks and --color aliases', () => {
    const element = document.createElement('div');
    const values: Record<string, string> = {
      '--color-danger': '#dc1111',
      '--color-info': '#0891b2',
      '--color-primary': '#123456',
      '--color-success': '#16a34a',
      '--color-warning': '#f59e0b',
      '--color-fg': '#abcdef',
      '--color-muted': '#64748b',
      '--color-border': '#cbd5e1',
      '--color-surface': '#ffffff',
    };

    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (name: string): string => values[name] ?? '',
    } as CSSStyleDeclaration);

    const theme = resolveTngEchartsTheme(element);

    expect(theme.primaryColor).toBe('#123456');
    expect(theme.successColor).toBe('#16a34a');
    expect(theme.warningColor).toBe('#f59e0b');
    expect(theme.dangerColor).toBe('#dc1111');
    expect(theme.infoColor).toBe('#0891b2');
    expect(theme.foregroundColor).toBe('#abcdef');
    expect(theme.mutedColor).toBe('#64748b');
    expect(theme.borderColor).toBe('#cbd5e1');
    expect(theme.surfaceColor).toBe('#ffffff');
    expect(theme.palette[0]).toBe('#123456');
  });

  it('prefers TailNG semantic CSS variables over compatibility aliases', () => {
    const element = document.createElement('div');
    const values: Record<string, string> = {
      '--color-primary': '#legacy',
      '--tng-semantic-accent-brand': '#tailng',
      '--tng-semantic-background-muted': '#edf4ff',
    };

    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (name: string): string => values[name] ?? '',
    } as CSSStyleDeclaration);

    const theme = resolveTngEchartsTheme(element);

    expect(theme.primaryColor).toBe('#tailng');
    expect(theme.palette[0]).toBe('#tailng');
    expect(theme.heatmapLowColor).toBe('#edf4ff');
  });

  it('falls back safely when CSS variables are missing', () => {
    const theme = resolveTngEchartsTheme(null);

    expect(theme).toEqual(TNG_CHART_DEFAULT_THEME);
  });
});
