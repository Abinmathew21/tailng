import type {
  TngLegacyLineChartInput,
  TngLegacyLineSeriesInput,
  TngLineChartInput,
  TngLineChartOptionInput,
} from './line-chart.types';
import type { TngChartSeries } from '../../core/chart-series.types';
import { TNG_CHART_DEFAULT_THEME } from '../../core/chart.tokens';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  createTngChartDataItem,
  createTngChartSeriesFromField,
  getTngChartFieldValue,
  getTngChartStringValue,
  isTngChartSeriesVisible,
  isTngRecord,
  requireTngChartField,
  resolveTngChartSeriesValueField,
} from '../../core/chart.utils';

function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.length > 0;
}

export function isTngLegacyLineChartInput(value: unknown): value is TngLegacyLineChartInput {
  return isTngRecord(value) && Array.isArray(value['categories']) && Array.isArray(value['series']);
}

function createLegacyAxisName(input: TngLegacyLineChartInput): string | undefined {
  if (!hasText(input.yAxisLabel)) {
    return undefined;
  }

  return hasText(input.unitLabel) ? `${input.yAxisLabel} (${input.unitLabel})` : input.yAxisLabel;
}

function createLegacyLineSeriesItem(
  series: TngLegacyLineSeriesInput,
): Readonly<Record<string, unknown>> {
  return {
    areaStyle:
      series.fillArea === true
        ? {
            color: series.color ?? TNG_CHART_DEFAULT_THEME.primaryColor,
            opacity: 0.18,
          }
        : undefined,
    data: series.values,
    itemStyle: {
      color: series.color ?? undefined,
    },
    lineStyle: {
      color: series.color ?? undefined,
      width: 3,
    },
    name: series.name,
    smooth: series.smooth ?? false,
    symbol: 'circle',
    symbolSize: 7,
    type: 'line',
  };
}

function createLegacyLineOption(input: TngLegacyLineChartInput): TngChartOption {
  return {
    grid: {
      bottom: 72,
      containLabel: true,
      left: 24,
      right: 24,
      top: hasText(input.chartTitle) ? 48 : 20,
    },
    legend: {
      show: false,
    },
    title: hasText(input.chartTitle) ? { text: input.chartTitle } : undefined,
    tooltip: {
      trigger: 'axis',
      valueFormatter: hasText(input.unitLabel)
        ? (value: unknown): string => `${String(value)} ${input.unitLabel}`
        : undefined,
    },
    xAxis: {
      axisLabel: {
        interval: 0,
        rotate: input.xAxisLabelRotation ?? 0,
      },
      data: [...input.categories],
      type: 'category',
    },
    yAxis: {
      name: createLegacyAxisName(input),
      type: 'value',
    },
    series: input.series.map((series) => createLegacyLineSeriesItem(series)),
  } as TngChartOption;
}

function inferYField(input: TngLineChartOptionInput): string | null {
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

function resolveLineSeries(input: TngLineChartOptionInput): readonly TngChartSeries[] {
  return createTngChartSeriesFromField(inferYField(input), input.series);
}

function createLineSeriesItem(
  input: TngLineChartOptionInput,
  series: TngChartSeries,
  index: number,
): Readonly<Record<string, unknown>> | null {
  const hiddenSeries = input.hiddenSeries ?? new Set<string>();

  if (!isTngChartSeriesVisible(series, hiddenSeries)) {
    return null;
  }

  const yField = resolveTngChartSeriesValueField(series);

  return {
    data: input.data.map((datum) => createTngChartDataItem(getTngChartFieldValue(datum, yField), datum)),
    id: series.key,
    itemStyle: {
      color: series.color ?? undefined,
    },
    lineStyle: {
      color: series.color ?? undefined,
      width: 3,
    },
    name: series.label ?? series.key,
    smooth: series.smooth ?? input.smooth,
    symbol: 'circle',
    symbolSize: 7,
    type: 'line',
    z: index,
  };
}

function createFieldLineOption(input: TngLineChartOptionInput): TngChartOption {
  const xField = requireTngChartField(input.xField, 'xField', 'line');
  const series = resolveLineSeries(input);
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
      data: input.data.map((datum) => getTngChartStringValue(datum, xField)),
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: series
      .map((seriesItem, index) => createLineSeriesItem(input, seriesItem, index))
      .filter((seriesItem): seriesItem is Readonly<Record<string, unknown>> => seriesItem !== null),
  } as TngChartOption;

  return applyTngChartOptionOverride(option, input.optionOverride);
}

export function createTngLineChartOption(input: TngLineChartInput): TngChartOption {
  return isTngLegacyLineChartInput(input) ? createLegacyLineOption(input) : createFieldLineOption(input);
}
