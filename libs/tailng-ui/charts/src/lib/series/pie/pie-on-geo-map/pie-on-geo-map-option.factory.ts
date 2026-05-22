import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_PIE_ON_GEO_MAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Pie on GEO Map",
  selector: "tng-pie-on-geo-map-chart",
  seriesType: "pie",
  slug: "pie-on-geo-map",
});

export type TngPieOnGeoMapChartOptionInput = TngCatalogChartOptionInput;

export function createTngPieOnGeoMapChartOption(input: TngPieOnGeoMapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_PIE_ON_GEO_MAP_CHART_PRESET);
}
