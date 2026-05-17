import { describe, expect, it, vi } from 'vitest';
import { resolveTngEchartsTheme } from './echarts-theme.factory';

describe('resolveTngEchartsTheme', () => {
  it('reads TailNG CSS variables with fallbacks', () => {
    const element = document.createElement('div');
    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (name: string): string => {
        if (name === '--tng-semantic-accent-brand') {
          return '#123456';
        }

        if (name === '--tng-semantic-foreground-primary') {
          return '#abcdef';
        }

        return '';
      },
    } as CSSStyleDeclaration);

    const theme = resolveTngEchartsTheme(element);

    expect(theme.primaryColor).toBe('#123456');
    expect(theme.foregroundColor).toBe('#abcdef');
    expect(theme.palette[0]).toBe('#123456');
  });
});
