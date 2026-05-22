import type { TngChartSeries } from '../../core/chart-series.types';
import type {
  TngChartData,
  TngChartOptionOverride,
} from '../../core/chart.types';

export type TngBarChartKind = 'bar' | 'line';

export type TngBarChartOrientation = 'vertical' | 'horizontal';

export type TngLegacyBarSeriesInput = Readonly<{
  color?: string | null;
  name: string;
  values: readonly number[];
}>;

export type TngLegacyBarChartInput = Readonly<{
  categories: readonly string[];
  chartTitle?: string | null;
  series: readonly TngLegacyBarSeriesInput[];
  showLegend?: boolean;
  unitLabel?: string | null;
  xAxisLabelRotation?: number;
  yAxisLabel?: string | null;
}>;

export type TngBarChartOptionInput = Readonly<{
  data: TngChartData;
  hiddenSeries?: ReadonlySet<string>;
  legend: boolean;
  optionOverride: TngChartOptionOverride | null;
  orientation: TngBarChartOrientation;
  series: readonly TngChartSeries[] | null;
  stacked: boolean;
  tooltip: boolean;
  xField: string;
  yField: string | null;
}>;

export type TngBarChartInput = TngBarChartOptionInput | TngLegacyBarChartInput;
