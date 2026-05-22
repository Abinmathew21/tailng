import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CARTESIAN_HEATMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Heatmap",
  coordinateSystem: "geo",
  features: [],
  name: "Cartesian Heatmap",
  selector: "tng-cartesian-heatmap-chart",
  seriesType: "heatmap",
  slug: "cartesian-heatmap",
});

export type TngCartesianHeatmapChartOptionInput = TngCatalogChartOptionInput;

export function createTngCartesianHeatmapChartOption(input: TngCartesianHeatmapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CARTESIAN_HEATMAP_CHART_PRESET);
}
