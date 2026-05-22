import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CANDLESTICK_WITH_BRUSH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Candlestick",
  coordinateSystem: "cartesian2d",
  features: ["brush"],
  name: "Candlestick with Brush",
  selector: "tng-candlestick-with-brush-chart",
  seriesType: "candlestick",
  slug: "candlestick-with-brush",
});

export type TngCandlestickWithBrushChartOptionInput = TngCatalogChartOptionInput;

export function createTngCandlestickWithBrushChartOption(input: TngCandlestickWithBrushChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CANDLESTICK_WITH_BRUSH_CHART_PRESET);
}
