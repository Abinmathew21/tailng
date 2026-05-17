import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LARGE_SCALE_CANDLESTICK_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Candlestick",
  coordinateSystem: "cartesian2d",
  features: ["large"],
  name: "Large Scale Candlestick",
  selector: "tng-large-scale-candlestick-chart",
  seriesType: "candlestick",
  slug: "large-scale-candlestick",
});

export type TngLargeScaleCandlestickChartOptionInput = TngCatalogChartOptionInput;

export function createTngLargeScaleCandlestickChartOption(input: TngLargeScaleCandlestickChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LARGE_SCALE_CANDLESTICK_CHART_PRESET);
}
