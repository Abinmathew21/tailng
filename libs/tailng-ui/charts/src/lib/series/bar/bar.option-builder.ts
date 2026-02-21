import {
  TNG_BAR_CHART_DEFAULT_AREA_OPACITY,
  TNG_BAR_CHART_DEFAULT_BAR_MAX_WIDTH,
  TNG_BAR_CHART_DEFAULT_KIND,
  TNG_BAR_CHART_DEFAULT_X_AXIS_LABEL_ROTATION,
} from './bar.defaults';
import type { TngBarChartInput, TngBarChartKind, TngBarSeriesInput } from './bar.types';
import type { TngChartOption } from '../../chart.types';

function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.length > 0;
}

function createAxisName(input: TngBarChartInput): string | undefined {
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

function createBarSeriesItem(series: TngBarSeriesInput): Readonly<Record<string, unknown>> {
  return {
    barMaxWidth: TNG_BAR_CHART_DEFAULT_BAR_MAX_WIDTH,
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: series.color ?? undefined,
    },
    name: series.name,
    type: 'bar',
    data: series.values,
  };
}

function createLineSeriesItem(series: TngBarSeriesInput): Readonly<Record<string, unknown>> {
  return {
    areaStyle: {
      color: series.color ?? '#0ea5e9',
      opacity: TNG_BAR_CHART_DEFAULT_AREA_OPACITY,
    },
    itemStyle: {
      color: series.color ?? undefined,
    },
    lineStyle: {
      color: series.color ?? undefined,
      width: 3,
    },
    name: series.name,
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    type: 'line',
    data: series.values,
  };
}

function createSeriesItem(
  series: TngBarSeriesInput,
  kind: TngBarChartKind,
): Readonly<Record<string, unknown>> {
  return kind === 'bar' ? createBarSeriesItem(series) : createLineSeriesItem(series);
}

function resolveXAxisLabelRotation(input: TngBarChartInput): number {
  return input.xAxisLabelRotation ?? TNG_BAR_CHART_DEFAULT_X_AXIS_LABEL_ROTATION;
}

function createTitle(input: TngBarChartInput): Readonly<{ text: string }> | undefined {
  if (!hasText(input.chartTitle)) {
    return undefined;
  }

  return { text: input.chartTitle };
}

function createTooltipValueFormatter(
  input: TngBarChartInput,
): ((value: number) => string) | undefined {
  if (!hasText(input.unitLabel)) {
    return undefined;
  }

  return (value: number): string => `${value.toLocaleString()} ${input.unitLabel}`;
}

function createLegend(
  input: TngBarChartInput,
): Readonly<{ data: readonly string[] }> | undefined {
  if (input.showLegend === false) {
    return undefined;
  }

  return {
    data: input.series.map((series) => series.name),
  };
}

export function createTngBarChartOption(
  input: TngBarChartInput,
  kind: TngBarChartKind = TNG_BAR_CHART_DEFAULT_KIND,
): TngChartOption {
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
    series: input.series.map((series) => createSeriesItem(series, kind)),
  };
}
