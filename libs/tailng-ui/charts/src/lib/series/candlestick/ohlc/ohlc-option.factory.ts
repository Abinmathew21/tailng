import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_OHLC_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Candlestick",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "OHLC",
  selector: "tng-ohlc-chart",
  seriesType: "candlestick",
  slug: "ohlc",
});

export type TngOhlcChartOptionInput = TngCatalogChartOptionInput;

export function createTngOhlcChartOption(input: TngOhlcChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_OHLC_CHART_PRESET);
}
