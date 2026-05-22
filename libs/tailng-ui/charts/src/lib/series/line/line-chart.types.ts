import type { TngChartSeries } from '../../core/chart-series.types';
import type {
  TngChartData,
  TngChartOptionOverride,
} from '../../core/chart.types';

export type TngLegacyLineSeriesInput = Readonly<{
  color?: string | null;
  fillArea?: boolean;
  name: string;
  smooth?: boolean;
  values: readonly number[];
}>;

export type TngLegacyLineChartInput = Readonly<{
  categories: readonly string[];
  chartTitle?: string | null;
  series: readonly TngLegacyLineSeriesInput[];
  showLegend?: boolean;
  unitLabel?: string | null;
  xAxisLabelRotation?: number;
  yAxisLabel?: string | null;
}>;

export type TngLineChartOptionInput = Readonly<{
  data: TngChartData;
  hiddenSeries?: ReadonlySet<string>;
  legend: boolean;
  optionOverride: TngChartOptionOverride | null;
  series: readonly TngChartSeries[] | null;
  smooth: boolean;
  tooltip: boolean;
  xField: string;
  yField: string | null;
}>;

export type TngLineChartInput = TngLineChartOptionInput | TngLegacyLineChartInput;
