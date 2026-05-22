import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GEO_MAP_GEO_LINES_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Geo Lines",
  selector: "tng-geo-map-geo-lines-chart",
  seriesType: "lines",
  slug: "geo-lines",
});

export type TngGeoMapGeoLinesChartOptionInput = TngCatalogChartOptionInput;

export function createTngGeoMapGeoLinesChartOption(input: TngGeoMapGeoLinesChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GEO_MAP_GEO_LINES_CHART_PRESET);
}
