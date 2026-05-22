import type {
  TngChartData,
  TngChartOptionOverride,
} from '../../core/chart.types';

export type TngScatterChartOptionInput = Readonly<{
  colorField: string | null;
  data: TngChartData;
  legend: boolean;
  optionOverride: TngChartOptionOverride | null;
  sizeField: string | null;
  tooltip: boolean;
  xField: string;
  yField: string;
}>;
