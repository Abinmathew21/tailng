import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_HEATMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Heatmap",
  coordinateSystem: "geo",
  features: ["large"],
  name: "Large Heatmap",
  selector: "tng-large-heatmap-chart",
  seriesType: "heatmap",
  slug: "large-heatmap",
});

export type TngLargeHeatmapChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeHeatmapChartOption(input: TngLargeHeatmapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_HEATMAP_CHART_PRESET);
}
