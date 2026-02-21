import { describe, expect, it } from 'vitest';
import { createTngLineChartOption } from './line.option-builder';
import type { TngLineChartInput } from './line.types';

function readSeries(
  option: Readonly<Record<string, unknown>>,
): readonly Readonly<Record<string, unknown>>[] {
  const typedOption = option as Readonly<{
    series?: readonly Readonly<Record<string, unknown>>[];
  }>;
  return typedOption.series ?? [];
}

const input: TngLineChartInput = {
  categories: ['India', 'China', 'USA'],
  series: [
    {
      name: 'Population',
      values: [1428.6, 1410.7, 339.7],
    },
  ],
  unitLabel: 'millions',
  yAxisLabel: 'Population',
};

describe('createTngLineChartOption', () => {
  it('creates line series by default', () => {
    const option = createTngLineChartOption(input);
    const firstSeries = readSeries(option)[0];

    expect(firstSeries).toBeDefined();
    expect(firstSeries?.type).toBe('line');
    expect(firstSeries?.smooth).toBe(true);
  });

  it('enables area style for series when fillArea is true', () => {
    const option = createTngLineChartOption({
      ...input,
      series: [
        {
          ...input.series[0],
          fillArea: true,
        },
      ],
    });
    const firstSeries = readSeries(option)[0];

    expect(firstSeries).toBeDefined();
    expect(firstSeries?.areaStyle).toMatchObject({
      opacity: 0.14,
    });
  });
});

describe('createTngLineChartOption axis', () => {
  it('builds y-axis name with unit label', () => {
    const option = createTngLineChartOption(input);
    const typedOption = option as Readonly<{
      yAxis?: Readonly<Record<string, unknown>>;
    }>;

    expect(typedOption.yAxis?.name).toBe('Population (millions)');
  });
});
