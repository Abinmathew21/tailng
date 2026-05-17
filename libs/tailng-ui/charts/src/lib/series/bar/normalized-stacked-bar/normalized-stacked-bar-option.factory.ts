import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_NORMALIZED_STACKED_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["normalized","stacked"],
  name: "Normalized Stacked Bar",
  selector: "tng-normalized-stacked-bar-chart",
  seriesType: "bar",
  slug: "normalized-stacked-bar",
});

export type TngNormalizedStackedBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngNormalizedStackedBarChartOption(input: TngNormalizedStackedBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_NORMALIZED_STACKED_BAR_CHART_PRESET);
}
