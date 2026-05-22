import type { TngAreaChartOptionInput } from './area-chart.types';
import type { TngChartSeries } from '../../core/chart-series.types';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  createTngChartDataItem,
  createTngChartSeriesFromField,
  getTngChartFieldValue,
  getTngChartStringValue,
  isTngChartSeriesVisible,
  resolveTngChartSeriesValueField,
} from '../../core/chart.utils';

function inferYField(input: TngAreaChartOptionInput): string | null {
  if (input.yField !== null && input.yField.length > 0) {
    return input.yField;
  }

  const firstDatum = input.data[0];
  if (firstDatum === undefined) {
    return null;
  }

  for (const [key, value] of Object.entries(firstDatum)) {
    if (key !== input.xField && typeof value === 'number') {
      return key;
    }
  }

  return null;
}

function createSeriesColorStyle(series: TngChartSeries): Readonly<Record<string, unknown>> {
  return {
    color: series.color ?? undefined,
  };
}

function resolveSeriesStack(input: TngAreaChartOptionInput, series: TngChartSeries): string | undefined {
  return input.stacked ? series.stack ?? 'total' : undefined;
}

function createAreaSeriesItem(
  input: TngAreaChartOptionInput,
  series: TngChartSeries,
  index: number,
): Readonly<Record<string, unknown>> | null {
  const hiddenSeries = input.hiddenSeries ?? new Set<string>();

  if (!isTngChartSeriesVisible(series, hiddenSeries)) {
    return null;
  }

  const yField = resolveTngChartSeriesValueField(series);

  return {
    areaStyle: {
      opacity: 0.18,
    },
    data: input.data.map((datum) => createTngChartDataItem(getTngChartFieldValue(datum, yField), datum)),
    id: series.key,
    itemStyle: createSeriesColorStyle(series),
    lineStyle: {
      ...createSeriesColorStyle(series),
      width: 3,
    },
    name: series.label ?? series.key,
    smooth: series.smooth ?? input.smooth,
    stack: resolveSeriesStack(input, series),
    symbol: 'circle',
    symbolSize: 7,
    type: 'line',
    z: index,
  };
}

export function createTngAreaChartOption(input: TngAreaChartOptionInput): TngChartOption {
  const series = createTngChartSeriesFromField(inferYField(input), input.series);
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
          trigger: 'axis',
        }
      : {
          show: false,
        },
    xAxis: {
      data: input.data.map((datum) => getTngChartStringValue(datum, input.xField)),
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: series
      .map((seriesItem, index) => createAreaSeriesItem(input, seriesItem, index))
      .filter((seriesItem): seriesItem is Readonly<Record<string, unknown>> => seriesItem !== null),
  } as TngChartOption;

  return applyTngChartOptionOverride(option, input.optionOverride);
}
