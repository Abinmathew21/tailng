import { describe, expect, it } from 'vitest';
import { createTngLineChartOption } from './line-option.factory';

function readFirstSeries(option: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const series = option['series'] as readonly Readonly<Record<string, unknown>>[];
  return series[0] ?? {};
}

describe('createTngLineChartOption', () => {
  it('creates a line series from field data', () => {
    const option = createTngLineChartOption({
      data: [
        { quarter: 'Q1', revenue: 10 },
        { quarter: 'Q2', revenue: 20 },
      ],
      legend: true,
      optionOverride: null,
      series: null,
      smooth: false,
      tooltip: true,
      xField: 'quarter',
      yField: 'revenue',
    }) as Readonly<Record<string, unknown>>;

    expect(option).toMatchObject({
      xAxis: {
        data: ['Q1', 'Q2'],
        type: 'category',
      },
    });
    expect(readFirstSeries(option)).toMatchObject({
      name: 'revenue',
      smooth: false,
      type: 'line',
    });
  });

  it('applies optionOverride last', () => {
    const option = createTngLineChartOption({
      data: [{ quarter: 'Q1', revenue: 10 }],
      legend: true,
      optionOverride: (option) => ({
        ...option,
        yAxis: { type: 'log' },
      }),
      series: null,
      smooth: false,
      tooltip: true,
      xField: 'quarter',
      yField: 'revenue',
    });

    expect(option).toMatchObject({
      yAxis: {
        type: 'log',
      },
    });
  });

  it('requires xField for field data', () => {
    expect(() =>
      createTngLineChartOption({
        data: [{ quarter: 'Q1', revenue: 10 }],
        legend: true,
        optionOverride: null,
        series: null,
        smooth: false,
        tooltip: true,
        xField: '',
        yField: 'revenue',
      }),
    ).toThrow('tng-line-chart requires xField.');
  });

  it('generates large line datasets without excessive transformation cost', () => {
    const data = Array.from({ length: 10_000 }, (_, index) => ({
      index,
      revenue: index * 2,
    }));
    const startedAt = performance.now();
    const option = createTngLineChartOption({
      data,
      legend: true,
      optionOverride: null,
      series: null,
      smooth: false,
      tooltip: true,
      xField: 'index',
      yField: 'revenue',
    }) as Readonly<Record<string, unknown>>;
    const duration = performance.now() - startedAt;
    const xAxis = option['xAxis'] as Readonly<Record<string, unknown>>;
    const xAxisData = xAxis['data'] as readonly unknown[];
    const seriesData = readFirstSeries(option)['data'] as readonly unknown[];

    expect(xAxisData).toHaveLength(10_000);
    expect(seriesData).toHaveLength(10_000);
    expect(duration).toBeLessThan(500);
  });
});
