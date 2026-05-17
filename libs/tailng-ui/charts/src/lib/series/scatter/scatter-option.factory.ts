import type { TngScatterChartOptionInput } from './scatter-chart.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../../core/chart.tokens';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  getTngChartFieldValue,
  getTngChartNumberValue,
} from '../../core/chart.utils';

function resolveSymbolSize(input: TngScatterChartOptionInput, datum: Readonly<Record<string, unknown>>): number {
  if (input.sizeField === null) {
    return 8;
  }

  const value = getTngChartNumberValue(datum, input.sizeField);
  if (value === null) {
    return 8;
  }

  return Math.max(6, Math.min(36, Math.sqrt(Math.abs(value)) * 2.4));
}

function resolveColor(input: TngScatterChartOptionInput, datum: Readonly<Record<string, unknown>>): string | undefined {
  if (input.colorField === null) {
    return undefined;
  }

  const value = getTngChartFieldValue(datum, input.colorField);
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function resolvePointValue(value: unknown): string | number | null {
  return typeof value === 'number' || typeof value === 'string' ? value : null;
}

function createScatterDataItem(
  input: TngScatterChartOptionInput,
  datum: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  return {
    [TNG_CHART_SOURCE_DATUM_KEY]: datum,
    itemStyle: {
      color: resolveColor(input, datum),
    },
    symbolSize: resolveSymbolSize(input, datum),
    value: [
      resolvePointValue(getTngChartFieldValue(datum, input.xField)),
      resolvePointValue(getTngChartFieldValue(datum, input.yField)),
    ],
  };
}

function createScatterSeries(input: TngScatterChartOptionInput): readonly Readonly<Record<string, unknown>>[] {
  return [
    {
      data: input.data.map((datum) => createScatterDataItem(input, datum)),
      name: input.yField,
      type: 'scatter',
    },
  ];
}

export function createTngScatterChartOption(input: TngScatterChartOptionInput): TngChartOption {
  const option = {
    grid: {
      bottom: 48,
      containLabel: true,
      left: 24,
      right: 24,
      top: 20,
    },
    legend: {
      show: false,
    },
    tooltip: input.tooltip
      ? {
          trigger: 'item',
        }
      : {
          show: false,
        },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'value',
    },
    series: createScatterSeries(input),
  } as TngChartOption;

  return applyTngChartOptionOverride(option, input.optionOverride);
}
