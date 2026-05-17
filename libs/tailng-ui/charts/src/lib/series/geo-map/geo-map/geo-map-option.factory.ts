import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GEO_MAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Geo Map",
  selector: "tng-geo-map-chart",
  seriesType: "map",
  slug: "geo-map",
});

export type TngGeoMapChartOptionInput = TngCatalogChartOptionInput;

export function createTngGeoMapChartOption(input: TngGeoMapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GEO_MAP_CHART_PRESET);
}
