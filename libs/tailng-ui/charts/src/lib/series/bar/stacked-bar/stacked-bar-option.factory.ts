import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_STACKED_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["stacked"],
  name: "Stacked Bar",
  selector: "tng-stacked-bar-chart",
  seriesType: "bar",
  slug: "stacked-bar",
});

export type TngStackedBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngStackedBarChartOption(input: TngStackedBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_STACKED_BAR_CHART_PRESET);
}
