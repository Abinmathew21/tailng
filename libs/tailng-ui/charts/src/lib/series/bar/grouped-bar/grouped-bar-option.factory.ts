import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GROUPED_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Grouped Bar",
  selector: "tng-grouped-bar-chart",
  seriesType: "bar",
  slug: "grouped-bar",
});

export type TngGroupedBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngGroupedBarChartOption(input: TngGroupedBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GROUPED_BAR_CHART_PRESET);
}
