import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_TIME_SERIES_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["timeAxis"],
  name: "Time Series Line",
  selector: "tng-time-series-line-chart",
  seriesType: "line",
  slug: "time-series-line",
});

export type TngTimeSeriesLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngTimeSeriesLineChartOption(input: TngTimeSeriesLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_TIME_SERIES_LINE_CHART_PRESET);
}
