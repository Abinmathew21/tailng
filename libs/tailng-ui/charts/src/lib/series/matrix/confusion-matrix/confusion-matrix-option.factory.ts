import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CONFUSION_MATRIX_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Confusion Matrix",
  selector: "tng-confusion-matrix-chart",
  seriesType: "heatmap",
  slug: "confusion-matrix",
});

export type TngConfusionMatrixChartOptionInput = TngCatalogChartOptionInput;

export function createTngConfusionMatrixChartOption(input: TngConfusionMatrixChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CONFUSION_MATRIX_CHART_PRESET);
}
