import type {
  TngChartData,
  TngChartOptionOverride,
} from '../../core/chart.types';

export type TngHeatmapChartOptionInput = Readonly<{
  data: TngChartData;
  legend: boolean;
  optionOverride: TngChartOptionOverride | null;
  tooltip: boolean;
  valueField: string;
  visualMap: boolean;
  xField: string;
  yField: string;
}>;
