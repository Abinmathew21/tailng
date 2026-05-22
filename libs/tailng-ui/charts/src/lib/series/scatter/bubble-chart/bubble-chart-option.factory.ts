import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BUBBLE_CHART_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Bubble Chart",
  selector: "tng-bubble-chart-chart",
  seriesType: "scatter",
  slug: "bubble-chart",
});

export type TngBubbleChartChartOptionInput = TngCatalogChartOptionInput;

export function createTngBubbleChartChartOption(input: TngBubbleChartChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BUBBLE_CHART_CHART_PRESET);
}
