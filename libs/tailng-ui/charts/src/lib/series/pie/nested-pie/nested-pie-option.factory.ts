import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_NESTED_PIE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "none",
  features: ["nested"],
  name: "Nested Pie",
  selector: "tng-nested-pie-chart",
  seriesType: "pie",
  slug: "nested-pie",
});

export type TngNestedPieChartOptionInput = TngCatalogChartOptionInput;

export function createTngNestedPieChartOption(input: TngNestedPieChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_NESTED_PIE_CHART_PRESET);
}
