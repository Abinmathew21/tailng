import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CHOROPLETH_MAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Choropleth Map",
  selector: "tng-choropleth-map-chart",
  seriesType: "map",
  slug: "choropleth-map",
});

export type TngChoroplethMapChartOptionInput = TngCatalogChartOptionInput;

export function createTngChoroplethMapChartOption(input: TngChoroplethMapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CHOROPLETH_MAP_CHART_PRESET);
}
