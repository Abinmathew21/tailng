import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_SCALE_AREA_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area","large"],
  name: "Large Scale Area",
  selector: "tng-large-scale-area-chart",
  seriesType: "line",
  slug: "large-scale-area",
});

export type TngLargeScaleAreaChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeScaleAreaChartOption(input: TngLargeScaleAreaChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_SCALE_AREA_CHART_PRESET);
}
