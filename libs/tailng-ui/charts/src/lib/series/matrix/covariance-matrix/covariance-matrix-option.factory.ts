import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_COVARIANCE_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Covariance Matrix",
  selector: "tng-covariance-matrix-chart",
  seriesType: "heatmap",
  slug: "covariance-matrix",
});

export type TngCovarianceMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngCovarianceMatrixChartOption(input: TngCovarianceMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_COVARIANCE_MATRIX_CHART_PRESET);
}
