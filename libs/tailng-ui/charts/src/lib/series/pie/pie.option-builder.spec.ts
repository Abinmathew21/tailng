import { describe, expect, it } from 'vitest';
import { createTngPieChartOption } from './pie.option-builder';
import type { TngPieChartInput } from './pie.types';

function readFirstSeries(option: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
  const typedOption = option as Readonly<{
    series?: readonly Readonly<Record<string, unknown>>[];
  }>;
  return typedOption.series?.[0] ?? {};
}

const input: TngPieChartInput = {
  chartTitle: 'Population Share',
  data: [
    { name: 'India', value: 1428.6 },
    { name: 'China', value: 1410.7 },
    { name: 'USA', value: 339.7 },
  ],
  unitLabel: 'millions',
};

describe('createTngPieChartOption', () => {
  it('creates pie series by default', () => {
    const option = createTngPieChartOption(input);
    const firstSeries = readFirstSeries(option);

    expect(firstSeries.type).toBe('pie');
    expect(firstSeries.radius).toEqual(['0%', '72%']);
  });

  it('creates donut radius when donut mode is enabled', () => {
    const option = createTngPieChartOption({
      ...input,
      donut: true,
    });
    const firstSeries = readFirstSeries(option);

    expect(firstSeries.radius).toEqual(['42%', '72%']);
  });

  it('includes value formatter when unit label exists', () => {
    const option = createTngPieChartOption(input);
    const typedOption = option as Readonly<{
      tooltip?: Readonly<{
        valueFormatter?: (value: number) => string;
      }>;
    }>;

    expect(typedOption.tooltip?.valueFormatter?.(10)).toBe('10 millions');
  });
});
