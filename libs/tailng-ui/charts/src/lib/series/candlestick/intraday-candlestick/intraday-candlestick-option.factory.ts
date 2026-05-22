import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_INTRADAY_CANDLESTICK_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Candlestick",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Intraday Candlestick",
  selector: "tng-intraday-candlestick-chart",
  seriesType: "candlestick",
  slug: "intraday-candlestick",
});

export type TngIntradayCandlestickChartOptionInput = TngCatalogChartOptionInput;

export function createTngIntradayCandlestickChartOption(input: TngIntradayCandlestickChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_INTRADAY_CANDLESTICK_CHART_PRESET);
}
