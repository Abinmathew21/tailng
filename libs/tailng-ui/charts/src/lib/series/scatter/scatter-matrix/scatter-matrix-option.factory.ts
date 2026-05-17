import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SCATTER_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Scatter Matrix",
  selector: "tng-scatter-matrix-chart",
  seriesType: "scatter",
  slug: "scatter-matrix",
});

export type TngScatterMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngScatterMatrixChartOption(input: TngScatterMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SCATTER_MATRIX_CHART_PRESET);
}
