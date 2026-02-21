export type TngPieSliceInput = Readonly<{
  color?: string | null;
  name: string;
  value: number;
}>;

export type TngPieChartInput = Readonly<{
  chartTitle?: string | null;
  data: readonly TngPieSliceInput[];
  donut?: boolean;
  showLegend?: boolean;
  unitLabel?: string | null;
}>;
