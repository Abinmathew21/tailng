import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CORRELATION_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Correlation Matrix",
  selector: "tng-correlation-matrix-chart",
  seriesType: "heatmap",
  slug: "correlation-matrix",
});

export type TngCorrelationMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngCorrelationMatrixChartOption(input: TngCorrelationMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CORRELATION_MATRIX_CHART_PRESET);
}
