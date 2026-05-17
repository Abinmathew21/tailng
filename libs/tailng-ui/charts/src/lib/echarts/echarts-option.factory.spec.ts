import { describe, expect, it } from 'vitest';
import { createTngEchartsOption } from './echarts-option.factory';
import type { TngChartResolvedTheme } from '../core/chart-theme.types';

const theme: TngChartResolvedTheme = {
  backgroundColor: '#ffffff',
  borderColor: '#eeeeee',
  dangerColor: '#dc2626',
  foregroundColor: '#111111',
  infoColor: '#0ea5e9',
  mutedColor: '#777777',
  palette: ['#111111', '#222222'],
  primaryColor: '#111111',
  successColor: '#22c55e',
  surfaceColor: '#ffffff',
  warningColor: '#f59e0b',
};

describe('createTngEchartsOption', () => {
  it('applies theme defaults while preserving explicit option values', () => {
    const option = createTngEchartsOption(
      {
        xAxis: {
          axisLabel: {
            color: '#custom',
          },
          type: 'category',
        },
      },
      theme,
    ) as Readonly<Record<string, unknown>>;

    const xAxis = option['xAxis'] as Readonly<Record<string, unknown>>;
    const axisLabel = xAxis['axisLabel'] as Readonly<Record<string, unknown>>;

    expect(option['color']).toEqual(theme.palette);
    expect(axisLabel['color']).toBe('#custom');
    expect(xAxis['type']).toBe('category');
  });
});
