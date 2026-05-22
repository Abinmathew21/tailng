import type {
  TngLegacyPieChartInput,
  TngLegacyPieSliceInput,
  TngPieChartInput,
  TngPieChartOptionInput,
} from './pie-chart.types';
import { TNG_CHART_SOURCE_DATUM_KEY } from '../../core/chart.tokens';
import type { TngChartOption } from '../../core/chart.types';
import {
  applyTngChartOptionOverride,
  getTngChartNumberValue,
  getTngChartStringValue,
  isTngRecord,
  requireTngChartField,
} from '../../core/chart.utils';

function hasText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value.length > 0;
}

export function isTngLegacyPieChartInput(value: unknown): value is TngLegacyPieChartInput {
  return (
    isTngRecord(value) &&
    Array.isArray(value['data']) &&
    !('nameField' in value) &&
    !('valueField' in value)
  );
}

function createLegacyPieSlice(slice: TngLegacyPieSliceInput): Readonly<Record<string, unknown>> {
  return {
    itemStyle: {
      color: slice.color ?? undefined,
    },
    name: slice.name,
    value: slice.value,
  };
}

function createLegacyPieOption(input: TngLegacyPieChartInput): TngChartOption {
  return {
    legend: {
      show: false,
    },
    title: hasText(input.chartTitle) ? { text: input.chartTitle } : undefined,
    tooltip: {
      trigger: 'item',
      valueFormatter: hasText(input.unitLabel)
        ? (value: unknown): string => `${String(value)} ${input.unitLabel}`
        : undefined,
    },
    series: [
      {
        avoidLabelOverlap: true,
        data: input.data.map((slice) => createLegacyPieSlice(slice)),
        radius: input.donut === true ? ['42%', '72%'] : ['0%', '72%'],
        type: 'pie',
      },
    ],
  } as TngChartOption;
}

function createRadius(input: TngPieChartOptionInput): readonly [string | number, string | number] {
  return input.donut ? [input.innerRadius, input.outerRadius] : ['0%', input.outerRadius];
}

function createPieOption(input: TngPieChartOptionInput): TngChartOption {
  const nameField = requireTngChartField(input.nameField, 'nameField', 'pie');
  const valueField = requireTngChartField(input.valueField, 'valueField', 'pie');
  const option = {
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
    series: [
      {
        avoidLabelOverlap: true,
        data: input.data.map((datum) => ({
          [TNG_CHART_SOURCE_DATUM_KEY]: datum,
          name: getTngChartStringValue(datum, nameField),
          value: getTngChartNumberValue(datum, valueField) ?? 0,
        })),
        radius: createRadius(input),
        type: 'pie',
      },
    ],
  } as TngChartOption;

  return applyTngChartOptionOverride(option, input.optionOverride);
}

export function createTngPieChartOption(input: TngPieChartInput): TngChartOption {
  return isTngLegacyPieChartInput(input) ? createLegacyPieOption(input) : createPieOption(input);
}
