import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_EFFECT_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: ["effect"],
  name: "Effect Scatter",
  selector: "tng-effect-scatter-chart",
  seriesType: "effectScatter",
  slug: "effect-scatter",
});

export type TngEffectScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngEffectScatterChartOption(input: TngEffectScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_EFFECT_SCATTER_CHART_PRESET);
}
