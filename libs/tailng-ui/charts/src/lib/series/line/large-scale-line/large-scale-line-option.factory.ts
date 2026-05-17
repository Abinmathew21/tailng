import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_SCALE_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["large"],
  name: "Large Scale Line",
  selector: "tng-large-scale-line-chart",
  seriesType: "line",
  slug: "large-scale-line",
});

export type TngLargeScaleLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeScaleLineChartOption(input: TngLargeScaleLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_SCALE_LINE_CHART_PRESET);
}
