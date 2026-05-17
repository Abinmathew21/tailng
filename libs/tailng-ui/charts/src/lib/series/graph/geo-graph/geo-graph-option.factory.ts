import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GEO_GRAPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Graph",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Geo Graph",
  selector: "tng-geo-graph-chart",
  seriesType: "graph",
  slug: "geo-graph",
});

export type TngGeoGraphChartOptionInput = TngCatalogChartOptionInput;

export function createTngGeoGraphChartOption(input: TngGeoGraphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GEO_GRAPH_CHART_PRESET);
}
