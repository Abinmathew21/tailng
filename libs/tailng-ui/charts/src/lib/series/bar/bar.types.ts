export type TngBarChartKind = 'bar' | 'line';

export type TngBarSeriesInput = Readonly<{
  color?: string | null;
  name: string;
  values: readonly number[];
}>;

export type TngBarChartInput = Readonly<{
  categories: readonly string[];
  chartTitle?: string | null;
  series: readonly TngBarSeriesInput[];
  showLegend?: boolean;
  unitLabel?: string | null;
  xAxisLabelRotation?: number;
  yAxisLabel?: string | null;
}>;
