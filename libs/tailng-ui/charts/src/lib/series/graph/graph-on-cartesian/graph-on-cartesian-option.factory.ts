import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRAPH_ON_CARTESIAN_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Graph",
  coordinateSystem: "none",
  features: [],
  name: "Graph on Cartesian",
  selector: "tng-graph-on-cartesian-chart",
  seriesType: "graph",
  slug: "graph-on-cartesian",
});

export type TngGraphOnCartesianChartOptionInput = TngCatalogChartOptionInput;

export function createTngGraphOnCartesianChartOption(input: TngGraphOnCartesianChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRAPH_ON_CARTESIAN_CHART_PRESET);
}
