import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRADIENT_AREA_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area","gradient"],
  name: "Gradient Area",
  selector: "tng-gradient-area-chart",
  seriesType: "line",
  slug: "gradient-area",
});

export type TngGradientAreaChartOptionInput = TngCatalogChartOptionInput;

export function createTngGradientAreaChartOption(input: TngGradientAreaChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRADIENT_AREA_CHART_PRESET);
}
