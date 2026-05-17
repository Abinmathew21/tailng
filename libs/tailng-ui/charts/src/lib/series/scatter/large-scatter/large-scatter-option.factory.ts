import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: ["large"],
  name: "Large Scatter",
  selector: "tng-large-scatter-chart",
  seriesType: "scatter",
  slug: "large-scatter",
});

export type TngLargeScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeScatterChartOption(input: TngLargeScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_SCATTER_CHART_PRESET);
}
