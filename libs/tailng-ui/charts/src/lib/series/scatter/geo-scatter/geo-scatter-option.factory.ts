import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SCATTER_GEO_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Geo Scatter",
  selector: "tng-scatter-geo-scatter-chart",
  seriesType: "scatter",
  slug: "geo-scatter",
});

export type TngScatterGeoScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngScatterGeoScatterChartOption(input: TngScatterGeoScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SCATTER_GEO_SCATTER_CHART_PRESET);
}
