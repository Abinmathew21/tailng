import type { TngChartSeries } from '../../core/chart-series.types';
import type {
  TngChartData,
  TngChartOptionOverride,
} from '../../core/chart.types';

export type TngAreaChartOptionInput = Readonly<{
  data: TngChartData;
  hiddenSeries?: ReadonlySet<string>;
  legend: boolean;
  optionOverride: TngChartOptionOverride | null;
  series: readonly TngChartSeries[] | null;
  smooth: boolean;
  stacked: boolean;
  tooltip: boolean;
  xField: string;
  yField: string | null;
}>;
