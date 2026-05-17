import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SYMBOL_PICTORIAL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "PictorialBar",
  coordinateSystem: "none",
  features: [],
  name: "Symbol Pictorial Bar",
  selector: "tng-symbol-pictorial-bar-chart",
  seriesType: "pictorialBar",
  slug: "symbol-pictorial-bar",
});

export type TngSymbolPictorialBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngSymbolPictorialBarChartOption(input: TngSymbolPictorialBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SYMBOL_PICTORIAL_BAR_CHART_PRESET);
}
