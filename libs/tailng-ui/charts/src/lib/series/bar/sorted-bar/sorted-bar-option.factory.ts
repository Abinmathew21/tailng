import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SORTED_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["sorted"],
  name: "Sorted Bar",
  selector: "tng-sorted-bar-chart",
  seriesType: "bar",
  slug: "sorted-bar",
});

export type TngSortedBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngSortedBarChartOption(input: TngSortedBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SORTED_BAR_CHART_PRESET);
}
