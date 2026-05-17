import type { TngHeatmapChartOptionInput } from './heatmap-chart.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../../core/chart.tokens';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  getTngChartNumberValue,
  getTngChartStringValue,
  getTngChartUniqueStrings,
} from '../../core/chart.utils';

function getValueRange(values: readonly number[]): Readonly<{ max: number; min: number }> {
  if (values.length === 0) {
    return { max: 0, min: 0 };
  }

  return {
    max: Math.max(...values),
    min: Math.min(...values),
  };
}

function createHeatmapAxis(categories: readonly string[]): Readonly<Record<string, unknown>> {
  return {
    data: categories,
    splitArea: {
      show: true,
    },
    type: 'category',
  };
}

function createHeatmapVisualMap(
  input: TngHeatmapChartOptionInput,
  range: Readonly<{ max: number; min: number }>,
): Readonly<Record<string, unknown>> {
  if (!input.visualMap) {
    return {
      show: false,
    };
  }

  return {
    bottom: 12,
    calculable: true,
    left: 'center',
    max: range.max,
    min: range.min,
    orient: 'horizontal',
  };
}

function createHeatmapSeries(
  input: TngHeatmapChartOptionInput,
  xCategories: readonly string[],
  yCategories: readonly string[],
): readonly Readonly<Record<string, unknown>>[] {
  return [
    {
      data: input.data.map((datum) => ({
        [TNG_CHART_SOURCE_DATUM_KEY]: datum,
        value: [
          xCategories.indexOf(getTngChartStringValue(datum, input.xField)),
          yCategories.indexOf(getTngChartStringValue(datum, input.yField)),
          getTngChartNumberValue(datum, input.valueField) ?? 0,
        ],
      })),
      label: {
        show: false,
      },
      name: input.valueField,
      type: 'heatmap',
    },
  ];
}

export function createTngHeatmapChartOption(input: TngHeatmapChartOptionInput): TngChartOption {
  const xCategories = getTngChartUniqueStrings(input.data, input.xField);
  const yCategories = getTngChartUniqueStrings(input.data, input.yField);
  const values = input.data
    .map((datum) => getTngChartNumberValue(datum, input.valueField))
    .filter((value): value is number => value !== null);
  const range = getValueRange(values);
  const option = {
    grid: {
      bottom: input.visualMap ? 72 : 24,
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
    visualMap: createHeatmapVisualMap(input, range),
    xAxis: createHeatmapAxis(xCategories),
    yAxis: createHeatmapAxis(yCategories),
    series: createHeatmapSeries(input, xCategories, yCategories),
  } as TngChartOption;

  return applyTngChartOptionOverride(option, input.optionOverride);
}
