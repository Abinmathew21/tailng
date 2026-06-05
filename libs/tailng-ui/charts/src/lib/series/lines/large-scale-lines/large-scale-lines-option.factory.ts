import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_SCALE_LINES_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Lines",
  coordinateSystem: "cartesian2d",
  features: ["large"],
  name: "Large Scale Lines",
  selector: "tng-large-scale-lines-chart",
  seriesType: "lines",
  slug: "large-scale-lines",
});

export type TngLargeScaleLinesChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeScaleLinesChartOption(input: TngLargeScaleLinesChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_SCALE_LINES_CHART_PRESET);
}
