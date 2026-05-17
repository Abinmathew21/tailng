import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRAPH_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Graph Matrix",
  selector: "tng-graph-matrix-chart",
  seriesType: "graph",
  slug: "graph-matrix",
});

export type TngGraphMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngGraphMatrixChartOption(input: TngGraphMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRAPH_MATRIX_CHART_PRESET);
}
