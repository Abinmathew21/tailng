import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DYNAMIC_GRAPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Graph",
  coordinateSystem: "none",
  features: ["dynamic"],
  name: "Dynamic Graph",
  selector: "tng-dynamic-graph-chart",
  seriesType: "graph",
  slug: "dynamic-graph",
});

export type TngDynamicGraphChartOptionInput = TngCatalogChartOptionInput;

export function createTngDynamicGraphChartOption(input: TngDynamicGraphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DYNAMIC_GRAPH_CHART_PRESET);
}
