import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_CANDLESTICK_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Candlestick",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Basic Candlestick",
  selector: "tng-basic-candlestick-chart",
  seriesType: "candlestick",
  slug: "basic-candlestick",
});

export type TngBasicCandlestickChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicCandlestickChartOption(input: TngBasicCandlestickChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_CANDLESTICK_CHART_PRESET);
}
