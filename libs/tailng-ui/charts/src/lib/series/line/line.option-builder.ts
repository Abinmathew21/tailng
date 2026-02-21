import {
  TNG_LINE_CHART_DEFAULT_AREA_OPACITY,
  TNG_LINE_CHART_DEFAULT_LINE_WIDTH,
  TNG_LINE_CHART_DEFAULT_SMOOTH,
  TNG_LINE_CHART_DEFAULT_SYMBOL_SIZE,
  TNG_LINE_CHART_DEFAULT_X_AXIS_LABEL_ROTATION,
} from './line.defaults';
import type { TngLineChartInput, TngLineSeriesInput } from './line.types';
import type { TngChartOption } from '../../chart.types';

function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.length > 0;
}

function createAxisName(input: TngLineChartInput): string | undefined {
  const baseName = input.yAxisLabel;
  if (!hasText(baseName)) {
    return undefined;
  }

  const unitLabel = input.unitLabel;
  if (!hasText(unitLabel)) {
    return baseName;
  }

  return `${baseName} (${unitLabel})`;
}

function createTitle(input: TngLineChartInput): Readonly<{ text: string }> | undefined {
  if (!hasText(input.chartTitle)) {
    return undefined;
  }

  return { text: input.chartTitle };
}

function createLegend(
  input: TngLineChartInput,
): Readonly<{ data: readonly string[] }> | undefined {
  if (input.showLegend === false) {
    return undefined;
  }

  return {
    data: input.series.map((series) => series.name),
  };
}

function createTooltipValueFormatter(
  input: TngLineChartInput,
): ((value: number) => string) | undefined {
  if (!hasText(input.unitLabel)) {
    return undefined;
  }

  return (value: number): string => `${value.toLocaleString()} ${input.unitLabel}`;
}

function resolveXAxisLabelRotation(input: TngLineChartInput): number {
  return input.xAxisLabelRotation ?? TNG_LINE_CHART_DEFAULT_X_AXIS_LABEL_ROTATION;
}

function createAreaStyle(series: TngLineSeriesInput): Readonly<Record<string, unknown>> | undefined {
  if (series.fillArea !== true) {
    return undefined;
  }

  return {
    color: series.color ?? '#0ea5e9',
    opacity: TNG_LINE_CHART_DEFAULT_AREA_OPACITY,
  };
}

function createLineSeriesItem(series: TngLineSeriesInput): Readonly<Record<string, unknown>> {
  return {
    areaStyle: createAreaStyle(series),
    itemStyle: {
      color: series.color ?? undefined,
    },
    lineStyle: {
      color: series.color ?? undefined,
      width: TNG_LINE_CHART_DEFAULT_LINE_WIDTH,
    },
    name: series.name,
    smooth: series.smooth ?? TNG_LINE_CHART_DEFAULT_SMOOTH,
    symbol: 'circle',
    symbolSize: TNG_LINE_CHART_DEFAULT_SYMBOL_SIZE,
    type: 'line',
    data: series.values,
  };
}

export function createTngLineChartOption(input: TngLineChartInput): TngChartOption {
  return {
    grid: {
      bottom: 72,
      left: 72,
      right: 24,
      top: 28,
    },
    legend: createLegend(input),
    title: createTitle(input),
    tooltip: {
      trigger: 'axis',
      valueFormatter: createTooltipValueFormatter(input),
    },
    xAxis: {
      axisLabel: {
        interval: 0,
        rotate: resolveXAxisLabelRotation(input),
      },
      data: input.categories,
      type: 'category',
    },
    yAxis: {
      name: createAxisName(input),
      type: 'value',
    },
    series: input.series.map((series) => createLineSeriesItem(series)),
  };
}
