import type {
  TngBarChartInput,
  TngBarChartKind,
  TngBarChartOptionInput,
  TngLegacyBarChartInput,
  TngLegacyBarSeriesInput,
} from './bar-chart.types';
import type { TngChartSeries } from '../../core/chart-series.types';
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

export function isTngLegacyBarChartInput(value: unknown): value is TngLegacyBarChartInput {
  return isTngRecord(value) && Array.isArray(value['categories']) && Array.isArray(value['series']);
}

function createLegacyAxisName(input: TngLegacyBarChartInput): string | undefined {
  if (!hasText(input.yAxisLabel)) {
    return undefined;
  }

  return hasText(input.unitLabel) ? `${input.yAxisLabel} (${input.unitLabel})` : input.yAxisLabel;
}

function createLegacyBarSeriesItem(series: TngLegacyBarSeriesInput): Readonly<Record<string, unknown>> {
  return {
    barMaxWidth: 44,
    data: series.values,
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: series.color ?? undefined,
    },
    name: series.name,
    type: 'bar',
  };
}

function createLegacyLineSeriesItem(series: TngLegacyBarSeriesInput): Readonly<Record<string, unknown>> {
  return {
    data: series.values,
    itemStyle: {
      color: series.color ?? undefined,
    },
    lineStyle: {
      color: series.color ?? undefined,
      width: 3,
    },
    name: series.name,
    smooth: true,
    type: 'line',
  };
}

function createLegacyBarOption(
  input: TngLegacyBarChartInput,
  kind: TngBarChartKind,
): TngChartOption {
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
    series: input.series.map((series) =>
      kind === 'line' ? createLegacyLineSeriesItem(series) : createLegacyBarSeriesItem(series),
    ),
  } as TngChartOption;
}

function inferYField(input: TngBarChartOptionInput): string | null {
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

function resolveBarSeries(input: TngBarChartOptionInput): readonly TngChartSeries[] {
  return createTngChartSeriesFromField(inferYField(input), input.series);
}

function createBarSeriesItem(
  input: TngBarChartOptionInput,
  series: TngChartSeries,
): Readonly<Record<string, unknown>> | null {
  const hiddenSeries = input.hiddenSeries ?? new Set<string>();

  if (!isTngChartSeriesVisible(series, hiddenSeries)) {
    return null;
  }

  const yField = resolveTngChartSeriesValueField(series);

  return {
    barMaxWidth: 44,
    data: input.data.map((datum) => createTngChartDataItem(getTngChartFieldValue(datum, yField), datum)),
    id: series.key,
    itemStyle: {
      borderRadius: input.orientation === 'vertical' ? [6, 6, 0, 0] : [0, 6, 6, 0],
      color: series.color ?? undefined,
    },
    name: series.label ?? series.key,
    stack: input.stacked ? series.stack ?? 'total' : undefined,
    type: 'bar',
  };
}

function createCategoryAxis(categories: readonly string[]): Readonly<Record<string, unknown>> {
  return {
    data: categories,
    type: 'category',
  };
}

function createValueAxis(): Readonly<Record<string, unknown>> {
  return {
    type: 'value',
  };
}

function createFieldBarOption(input: TngBarChartOptionInput): TngChartOption {
  const xField = requireTngChartField(input.xField, 'xField', 'bar');
  const categories = input.data.map((datum) => getTngChartStringValue(datum, xField));
  const vertical = input.orientation === 'vertical';
  const option = {
    grid: {
      bottom: vertical ? 48 : 20,
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
    xAxis: vertical ? createCategoryAxis(categories) : createValueAxis(),
    yAxis: vertical ? createValueAxis() : createCategoryAxis(categories),
    series: resolveBarSeries(input)
      .map((series) => createBarSeriesItem(input, series))
      .filter((series): series is Readonly<Record<string, unknown>> => series !== null),
  } as TngChartOption;

  return applyTngChartOptionOverride(option, input.optionOverride);
}

export function createTngBarChartOption(
  input: TngBarChartInput,
  kind: TngBarChartKind = 'bar',
): TngChartOption {
  return isTngLegacyBarChartInput(input)
    ? createLegacyBarOption(input, kind)
    : createFieldBarOption(input);
}
