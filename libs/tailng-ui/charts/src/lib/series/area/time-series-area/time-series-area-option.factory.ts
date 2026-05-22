import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_TIME_SERIES_AREA_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area","timeAxis"],
  name: "Time Series Area",
  selector: "tng-time-series-area-chart",
  seriesType: "line",
  slug: "time-series-area",
});

export type TngTimeSeriesAreaChartOptionInput = TngCatalogChartOptionInput;

export function createTngTimeSeriesAreaChartOption(input: TngTimeSeriesAreaChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_TIME_SERIES_AREA_CHART_PRESET);
}
