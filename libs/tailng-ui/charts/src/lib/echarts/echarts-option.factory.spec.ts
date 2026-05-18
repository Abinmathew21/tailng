import { describe, expect, it } from 'vitest';
import { createTngEchartsOption } from './echarts-option.factory';
import type { TngChartResolvedTheme } from '../core/chart-theme.types';

const theme: TngChartResolvedTheme = {
  axisLabelColor: '#777777',
  axisLineColor: '#eeeeee',
  backgroundColor: '#ffffff',
  borderColor: '#eeeeee',
  dangerColor: '#dc2626',
  foregroundColor: '#111111',
  gridLineColor: '#eeeeee',
  heatmapHighColor: '#111111',
  heatmapLowColor: '#f8fafc',
  heatmapMidColor: '#0ea5e9',
  infoColor: '#0ea5e9',
  mutedColor: '#777777',
  mutedTextColor: '#777777',
  palette: ['#111111', '#222222'],
  primaryColor: '#111111',
  successColor: '#22c55e',
  surfaceColor: '#ffffff',
  textColor: '#111111',
  tooltipBackgroundColor: '#ffffff',
  tooltipBorderColor: '#eeeeee',
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

  it('maps TailNG theme fields into ECharts theme categories', () => {
    const option = createTngEchartsOption({}, theme) as Readonly<Record<string, unknown>>;
    const title = option['title'] as Readonly<Record<string, unknown>>;
    const legend = option['legend'] as Readonly<Record<string, unknown>>;
    const tooltip = option['tooltip'] as Readonly<Record<string, unknown>>;
    const xAxis = option['xAxis'] as Readonly<Record<string, unknown>>;
    const splitLine = xAxis['splitLine'] as Readonly<Record<string, unknown>>;
    const splitLineStyle = splitLine['lineStyle'] as Readonly<Record<string, unknown>>;
    const legendTextStyle = legend['textStyle'] as Readonly<Record<string, unknown>>;
    const titleTextStyle = title['textStyle'] as Readonly<Record<string, unknown>>;
    const tooltipTextStyle = tooltip['textStyle'] as Readonly<Record<string, unknown>>;

    expect(option['color']).toEqual(theme.palette);
    expect(titleTextStyle['color']).toBe(theme.textColor);
    expect(legendTextStyle['color']).toBe(theme.mutedTextColor);
    expect(tooltip['backgroundColor']).toBe(theme.tooltipBackgroundColor);
    expect(tooltip['borderColor']).toBe(theme.tooltipBorderColor);
    expect(tooltipTextStyle['color']).toBe(theme.textColor);
    expect(splitLineStyle['color']).toBe(theme.gridLineColor);
    expect(option['visualMap']).toBeUndefined();
  });

  it('only applies visualMap theme defaults when the chart option declares visualMap', () => {
    const option = createTngEchartsOption(
      {
        visualMap: {
          max: 100,
          min: 0,
        },
      },
      theme,
    ) as Readonly<Record<string, unknown>>;
    const visualMap = option['visualMap'] as Readonly<Record<string, unknown>>;
    const inRange = visualMap['inRange'] as Readonly<Record<string, unknown>>;
    const textStyle = visualMap['textStyle'] as Readonly<Record<string, unknown>>;

    expect(visualMap['max']).toBe(100);
    expect(visualMap['min']).toBe(0);
    expect(inRange['color']).toEqual([
      theme.heatmapLowColor,
      theme.heatmapMidColor,
      theme.heatmapHighColor,
    ]);
    expect(textStyle['color']).toBe(theme.mutedTextColor);
  });

  it('applies axis theme defaults to axis arrays', () => {
    const option = createTngEchartsOption(
      {
        xAxis: [
          {
            type: 'category',
          },
          {
            axisLine: {
              lineStyle: {
                color: '#custom-axis',
              },
            },
          },
        ],
      },
      theme,
    ) as Readonly<Record<string, unknown>>;

    const xAxis = option['xAxis'] as readonly Readonly<Record<string, unknown>>[];
    const firstAxisLabel = xAxis[0]?.['axisLabel'] as Readonly<Record<string, unknown>>;
    const secondAxisLine = xAxis[1]?.['axisLine'] as Readonly<Record<string, unknown>>;
    const secondAxisLineStyle = secondAxisLine['lineStyle'] as Readonly<Record<string, unknown>>;

    expect(firstAxisLabel['color']).toBe(theme.axisLabelColor);
    expect(secondAxisLineStyle['color']).toBe('#custom-axis');
  });
});
