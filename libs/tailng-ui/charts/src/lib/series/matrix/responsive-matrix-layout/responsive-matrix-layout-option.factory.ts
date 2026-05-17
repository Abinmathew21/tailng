import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_RESPONSIVE_MATRIX_LAYOUT_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Matrix",
  coordinateSystem: "matrix",
  features: ["matrix"],
  name: "Responsive Matrix Layout",
  selector: "tng-responsive-matrix-layout-chart",
  seriesType: "heatmap",
  slug: "responsive-matrix-layout",
});

export type TngResponsiveMatrixLayoutChartOptionInput = TngCatalogChartOptionInput;

export function createTngResponsiveMatrixLayoutChartOption(input: TngResponsiveMatrixLayoutChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_RESPONSIVE_MATRIX_LAYOUT_CHART_PRESET);
}
