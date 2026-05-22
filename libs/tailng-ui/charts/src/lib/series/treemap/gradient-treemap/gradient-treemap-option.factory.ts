import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRADIENT_TREEMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Treemap",
  coordinateSystem: "geo",
  features: ["gradient"],
  name: "Gradient Treemap",
  selector: "tng-gradient-treemap-chart",
  seriesType: "treemap",
  slug: "gradient-treemap",
});

export type TngGradientTreemapChartOptionInput = TngCatalogChartOptionInput;

export function createTngGradientTreemapChartOption(input: TngGradientTreemapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRADIENT_TREEMAP_CHART_PRESET);
}
