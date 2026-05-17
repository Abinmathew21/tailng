import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Basic Matrix",
  selector: "tng-basic-matrix-chart",
  seriesType: "heatmap",
  slug: "basic-matrix",
});

export type TngBasicMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicMatrixChartOption(input: TngBasicMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_MATRIX_CHART_PRESET);
}
