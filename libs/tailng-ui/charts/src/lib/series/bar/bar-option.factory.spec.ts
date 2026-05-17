import { describe, expect, it } from 'vitest';
import { createTngBarChartOption } from './bar-option.factory';

function readFirstSeries(option: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const series = option['series'] as readonly Readonly<Record<string, unknown>>[];
  return series[0] ?? {};
}

describe('createTngBarChartOption', () => {
  it('creates a vertical bar series from field data', () => {
    const option = createTngBarChartOption({
      data: [
        { country: 'India', population: 1428 },
        { country: 'China', population: 1410 },
      ],
      legend: true,
      optionOverride: null,
      orientation: 'vertical',
      series: null,
      stacked: false,
      tooltip: true,
      xField: 'country',
      yField: 'population',
    }) as Readonly<Record<string, unknown>>;

    expect(option).toMatchObject({
      xAxis: {
        data: ['India', 'China'],
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
    });
    expect(readFirstSeries(option)).toMatchObject({
      name: 'population',
      type: 'bar',
    });
  });

  it('supports stacked horizontal bars', () => {
    const option = createTngBarChartOption({
      data: [{ country: 'India', population: 1428 }],
      legend: true,
      optionOverride: null,
      orientation: 'horizontal',
      series: null,
      stacked: true,
      tooltip: true,
      xField: 'country',
      yField: 'population',
    }) as Readonly<Record<string, unknown>>;

    expect(option).toMatchObject({
      xAxis: {
        type: 'value',
      },
      yAxis: {
        data: ['India'],
        type: 'category',
      },
    });
    expect(readFirstSeries(option)['stack']).toBe('total');
  });

  it('requires xField for field data', () => {
    expect(() =>
      createTngBarChartOption({
        data: [{ country: 'India', population: 1428 }],
        legend: true,
        optionOverride: null,
        orientation: 'vertical',
        series: null,
        stacked: false,
        tooltip: true,
        xField: '',
        yField: 'population',
      }),
    ).toThrow('tng-bar-chart requires xField.');
  });
});
