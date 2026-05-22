import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_FORCE_GRAPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Graph",
  coordinateSystem: "none",
  features: [],
  name: "Force Graph",
  selector: "tng-force-graph-chart",
  seriesType: "graph",
  slug: "force-graph",
});

export type TngForceGraphChartOptionInput = TngCatalogChartOptionInput;

export function createTngForceGraphChartOption(input: TngForceGraphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_FORCE_GRAPH_CHART_PRESET);
}
