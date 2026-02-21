import { describe, expect, it } from 'vitest';
import { createTngBarChartOption } from './bar.option-builder';
import type { TngBarChartInput } from './bar.types';

function readSeries(
  option: Readonly<Record<string, unknown>>,
): readonly Readonly<Record<string, unknown>>[] {
  const typedOption = option as Readonly<{
    series?: readonly Readonly<Record<string, unknown>>[];
  }>;
  return typedOption.series ?? [];
}

describe('createTngBarChartOption', () => {
  const input: TngBarChartInput = {
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

  it('creates bar series by default', () => {
    const option = createTngBarChartOption(input);
    const firstSeries = readSeries(option)[0];

    expect(firstSeries).toBeDefined();
    expect(firstSeries?.type).toBe('bar');
    expect(firstSeries?.barMaxWidth).toBe(44);
  });

  it('creates line series when kind is line', () => {
    const option = createTngBarChartOption(input, 'line');
    const firstSeries = readSeries(option)[0];

    expect(firstSeries).toBeDefined();
    expect(firstSeries?.type).toBe('line');
    expect(firstSeries?.smooth).toBe(true);
  });

  it('builds y-axis name with unit label', () => {
    const option = createTngBarChartOption(input);
    const typedOption = option as Readonly<{
      yAxis?: Readonly<Record<string, unknown>>;
    }>;

    expect(typedOption.yAxis?.name).toBe('Population (millions)');
  });
});
