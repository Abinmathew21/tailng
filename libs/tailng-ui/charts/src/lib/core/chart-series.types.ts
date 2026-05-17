export type TngChartSeriesType = 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'heatmap';

export type TngChartSeries = {
  key: string;
  label?: string;
  type?: TngChartSeriesType;
  xField?: string;
  yField?: string;
  valueField?: string;
  categoryField?: string;
  color?: string | null;
  stack?: string | null;
  hidden?: boolean;
  smooth?: boolean;
}

export type TngChartLegendItem = Readonly<{
  color: string | null;
  disabled?: boolean;
  hidden?: boolean;
  key: string;
  label: string;
}>;
