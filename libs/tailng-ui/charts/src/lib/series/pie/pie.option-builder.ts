import {
  TNG_PIE_CHART_DEFAULT_INNER_RADIUS,
  TNG_PIE_CHART_DEFAULT_OUTER_RADIUS,
  TNG_PIE_CHART_DONUT_INNER_RADIUS,
} from './pie.defaults';
import type { TngPieChartInput, TngPieSliceInput } from './pie.types';
import type { TngChartOption } from '../../chart.types';

function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.length > 0;
}

function createTitle(input: TngPieChartInput): Readonly<{ text: string }> | undefined {
  if (!hasText(input.chartTitle)) {
    return undefined;
  }

  return { text: input.chartTitle };
}

function createLegend(input: TngPieChartInput): Readonly<Record<string, unknown>> | undefined {
  if (input.showLegend === false) {
    return undefined;
  }

  return {
    data: input.data.map((slice) => slice.name),
    orient: 'vertical',
    right: 0,
    top: 'middle',
  };
}

function createTooltipValueFormatter(
  input: TngPieChartInput,
): ((value: number) => string) | undefined {
  if (!hasText(input.unitLabel)) {
    return undefined;
  }

  return (value: number): string => `${value.toLocaleString()} ${input.unitLabel}`;
}

function createRadius(input: TngPieChartInput): readonly [string, string] {
  if (input.donut === true) {
    return [TNG_PIE_CHART_DONUT_INNER_RADIUS, TNG_PIE_CHART_DEFAULT_OUTER_RADIUS];
  }

  return [TNG_PIE_CHART_DEFAULT_INNER_RADIUS, TNG_PIE_CHART_DEFAULT_OUTER_RADIUS];
}

function createSliceItem(slice: TngPieSliceInput): Readonly<Record<string, unknown>> {
  return {
    name: slice.name,
    value: slice.value,
    itemStyle: {
      color: slice.color ?? undefined,
    },
  };
}

export function createTngPieChartOption(input: TngPieChartInput): TngChartOption {
  return {
    title: createTitle(input),
    legend: createLegend(input),
    tooltip: {
      trigger: 'item',
      valueFormatter: createTooltipValueFormatter(input),
    },
    series: [
      {
        type: 'pie',
        radius: createRadius(input),
        avoidLabelOverlap: true,
        data: input.data.map((slice) => createSliceItem(slice)),
      },
    ],
  };
}
