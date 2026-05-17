import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GEO_MAP_GEO_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Geo Scatter",
  selector: "tng-geo-map-geo-scatter-chart",
  seriesType: "scatter",
  slug: "geo-scatter",
});

export type TngGeoMapGeoScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngGeoMapGeoScatterChartOption(input: TngGeoMapGeoScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GEO_MAP_GEO_SCATTER_CHART_PRESET);
}
