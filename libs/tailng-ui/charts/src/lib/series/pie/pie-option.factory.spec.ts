import { describe, expect, it } from 'vitest';
import { createTngPieChartOption } from './pie-option.factory';

function readFirstSeries(option: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const series = option['series'] as readonly Readonly<Record<string, unknown>>[];
  return series[0] ?? {};
}

describe('createTngPieChartOption', () => {
  it('creates pie data from name and value fields', () => {
    const option = createTngPieChartOption({
      data: [
        { country: 'India', population: 1428 },
        { country: 'China', population: 1410 },
      ],
      donut: false,
      innerRadius: '45%',
      legend: true,
      nameField: 'country',
      optionOverride: null,
      outerRadius: '70%',
      tooltip: true,
      valueField: 'population',
    }) as Readonly<Record<string, unknown>>;

    expect(readFirstSeries(option)).toMatchObject({
      radius: ['0%', '70%'],
      type: 'pie',
    });
  });

  it('creates donut radius when donut mode is enabled', () => {
    const option = createTngPieChartOption({
      data: [{ country: 'India', population: 1428 }],
      donut: true,
      innerRadius: '40%',
      legend: true,
      nameField: 'country',
      optionOverride: null,
      outerRadius: '72%',
      tooltip: true,
      valueField: 'population',
    }) as Readonly<Record<string, unknown>>;

    expect(readFirstSeries(option)['radius']).toEqual(['40%', '72%']);
  });

  it('requires nameField for field data', () => {
    expect(() =>
      createTngPieChartOption({
        data: [{ country: 'India', population: 1428 }],
        donut: false,
        innerRadius: '45%',
        legend: true,
        nameField: '',
        optionOverride: null,
        outerRadius: '70%',
        tooltip: true,
        valueField: 'population',
      }),
    ).toThrow('tng-pie-chart requires nameField.');
  });

  it('requires valueField for field data', () => {
    expect(() =>
      createTngPieChartOption({
        data: [{ country: 'India', population: 1428 }],
        donut: false,
        innerRadius: '45%',
        legend: true,
        nameField: 'country',
        optionOverride: null,
        outerRadius: '70%',
        tooltip: true,
        valueField: '',
      }),
    ).toThrow('tng-pie-chart requires valueField.');
  });
});
