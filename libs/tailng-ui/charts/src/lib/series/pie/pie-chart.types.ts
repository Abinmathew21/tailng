import type {
  TngChartData,
  TngChartOptionOverride,
} from '../../core/chart.types';

export type TngLegacyPieSliceInput = Readonly<{
  color?: string | null;
  name: string;
  value: number;
}>;

export type TngLegacyPieChartInput = Readonly<{
  chartTitle?: string | null;
  data: readonly TngLegacyPieSliceInput[];
  donut?: boolean;
  showLegend?: boolean;
  unitLabel?: string | null;
}>;

export type TngPieChartOptionInput = Readonly<{
  data: TngChartData;
  donut: boolean;
  innerRadius: string | number;
  legend: boolean;
  nameField: string;
  optionOverride: TngChartOptionOverride | null;
  outerRadius: string | number;
  tooltip: boolean;
  valueField: string;
}>;

export type TngPieChartInput = TngPieChartOptionInput | TngLegacyPieChartInput;
