import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_PIE_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Pie Matrix",
  selector: "tng-pie-matrix-chart",
  seriesType: "pie",
  slug: "pie-matrix",
});

export type TngPieMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngPieMatrixChartOption(input: TngPieMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_PIE_MATRIX_CHART_PRESET);
}
