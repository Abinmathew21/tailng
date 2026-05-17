import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DYNAMIC_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["dynamic"],
  name: "Dynamic Bar",
  selector: "tng-dynamic-bar-chart",
  seriesType: "bar",
  slug: "dynamic-bar",
});

export type TngDynamicBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngDynamicBarChartOption(input: TngDynamicBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DYNAMIC_BAR_CHART_PRESET);
}
