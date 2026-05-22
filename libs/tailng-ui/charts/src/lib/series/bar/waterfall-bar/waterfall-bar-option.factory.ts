import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_WATERFALL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["waterfall"],
  name: "Waterfall Bar",
  selector: "tng-waterfall-bar-chart",
  seriesType: "bar",
  slug: "waterfall-bar",
});

export type TngWaterfallBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngWaterfallBarChartOption(input: TngWaterfallBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_WATERFALL_BAR_CHART_PRESET);
}
