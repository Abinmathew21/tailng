import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_JITTER_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: ["jitter"],
  name: "Jitter Scatter",
  selector: "tng-jitter-scatter-chart",
  seriesType: "scatter",
  slug: "jitter-scatter",
});

export type TngJitterScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngJitterScatterChartOption(input: TngJitterScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_JITTER_SCATTER_CHART_PRESET);
}
