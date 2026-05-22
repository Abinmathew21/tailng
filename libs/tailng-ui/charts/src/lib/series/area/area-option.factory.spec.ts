import { describe, expect, it } from 'vitest';
import { createTngAreaChartOption } from './area-option.factory';

describe('createTngAreaChartOption', () => {
  it('creates a line series with area style', () => {
    const option = createTngAreaChartOption({
      data: [{ month: 'Jan', value: 12 }],
      legend: true,
      optionOverride: null,
      series: null,
      smooth: true,
      stacked: true,
      tooltip: true,
      xField: 'month',
      yField: 'value',
    }) as Readonly<Record<string, unknown>>;
    const series = option['series'] as readonly Readonly<Record<string, unknown>>[];

    expect(series[0]).toMatchObject({
      areaStyle: {
        opacity: 0.18,
      },
      smooth: true,
      stack: 'total',
      type: 'line',
    });
  });
});
