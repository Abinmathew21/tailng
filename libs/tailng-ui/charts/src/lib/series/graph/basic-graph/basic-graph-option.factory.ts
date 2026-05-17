import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_GRAPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Graph",
  coordinateSystem: "none",
  features: [],
  name: "Basic Graph",
  selector: "tng-basic-graph-chart",
  seriesType: "graph",
  slug: "basic-graph",
});

export type TngBasicGraphChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicGraphChartOption(input: TngBasicGraphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_GRAPH_CHART_PRESET);
}
