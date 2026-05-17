import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_AGGREGATED_BOXPLOT_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Boxplot",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Aggregated Boxplot",
  selector: "tng-aggregated-boxplot-chart",
  seriesType: "boxplot",
  slug: "aggregated-boxplot",
});

export type TngAggregatedBoxplotChartOptionInput = TngCatalogChartOptionInput;

export function createTngAggregatedBoxplotChartOption(input: TngAggregatedBoxplotChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_AGGREGATED_BOXPLOT_CHART_PRESET);
}
