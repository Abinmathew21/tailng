import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DISCRETE_COLOR_HEATMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Heatmap",
  coordinateSystem: "geo",
  features: ["discreteVisualMap"],
  name: "Discrete Color Heatmap",
  selector: "tng-discrete-color-heatmap-chart",
  seriesType: "heatmap",
  slug: "discrete-color-heatmap",
});

export type TngDiscreteColorHeatmapChartOptionInput = TngCatalogChartOptionInput;

export function createTngDiscreteColorHeatmapChartOption(input: TngDiscreteColorHeatmapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DISCRETE_COLOR_HEATMAP_CHART_PRESET);
}
