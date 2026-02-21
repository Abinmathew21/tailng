export type TngLineSeriesInput = Readonly<{
  color?: string | null;
  fillArea?: boolean;
  name: string;
  smooth?: boolean;
  values: readonly number[];
}>;

export type TngLineChartInput = Readonly<{
  categories: readonly string[];
  chartTitle?: string | null;
  series: readonly TngLineSeriesInput[];
  showLegend?: boolean;
  unitLabel?: string | null;
  xAxisLabelRotation?: number;
  yAxisLabel?: string | null;
}>;
