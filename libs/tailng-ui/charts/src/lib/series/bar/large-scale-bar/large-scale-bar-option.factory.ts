import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_SCALE_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["large"],
  name: "Large Scale Bar",
  selector: "tng-large-scale-bar-chart",
  seriesType: "bar",
  slug: "large-scale-bar",
});

export type TngLargeScaleBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeScaleBarChartOption(input: TngLargeScaleBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_SCALE_BAR_CHART_PRESET);
}
