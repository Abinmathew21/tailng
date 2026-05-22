import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MATRIX_HEATMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Heatmap",
  coordinateSystem: "geo",
  features: ["matrix"],
  name: "Matrix Heatmap",
  selector: "tng-matrix-heatmap-chart",
  seriesType: "heatmap",
  slug: "matrix-heatmap",
});

export type TngMatrixHeatmapChartOptionInput = TngCatalogChartOptionInput;

export function createTngMatrixHeatmapChartOption(input: TngMatrixHeatmapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MATRIX_HEATMAP_CHART_PRESET);
}
