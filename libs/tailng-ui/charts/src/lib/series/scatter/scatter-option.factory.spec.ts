import { describe, expect, it } from 'vitest';
import { createTngScatterChartOption } from './scatter-option.factory';

describe('createTngScatterChartOption', () => {
  it('creates scatter data points from x and y fields', () => {
    const option = createTngScatterChartOption({
      colorField: null,
      data: [{ x: 1, y: 2, size: 16 }],
      legend: true,
      optionOverride: null,
      sizeField: 'size',
      tooltip: true,
      xField: 'x',
      yField: 'y',
    }) as Readonly<Record<string, unknown>>;
    const series = option['series'] as readonly Readonly<Record<string, unknown>>[];

    expect(series[0]).toMatchObject({
      name: 'y',
      type: 'scatter',
    });
  });

  it('generates large scatter datasets without excessive transformation cost', () => {
    const data = Array.from({ length: 10_000 }, (_, index) => ({
      size: index % 100,
      x: index,
      y: index * 2,
    }));
    const startedAt = performance.now();
    const option = createTngScatterChartOption({
      colorField: null,
      data,
      legend: true,
      optionOverride: null,
      sizeField: 'size',
      tooltip: true,
      xField: 'x',
      yField: 'y',
    }) as Readonly<Record<string, unknown>>;
    const duration = performance.now() - startedAt;
    const series = option['series'] as readonly Readonly<Record<string, unknown>>[];
    const seriesData = series[0]?.['data'] as readonly unknown[];

    expect(seriesData).toHaveLength(10_000);
    expect(duration).toBeLessThan(500);
  });
});
