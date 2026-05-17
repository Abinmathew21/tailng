import type { TngChartDatum } from './chart.types';

export type TngChartPointEvent = {
  seriesKey: string | null;
  seriesName: string | null;
  datum: TngChartDatum | null;
  value: unknown;
  index: number | null;
  nativeEvent: unknown;
}
