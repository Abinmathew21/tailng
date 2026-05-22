import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_NEGATIVE_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["negative"],
  name: "Negative Bar",
  selector: "tng-negative-bar-chart",
  seriesType: "bar",
  slug: "negative-bar",
});

export type TngNegativeBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngNegativeBarChartOption(input: TngNegativeBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_NEGATIVE_BAR_CHART_PRESET);
}
