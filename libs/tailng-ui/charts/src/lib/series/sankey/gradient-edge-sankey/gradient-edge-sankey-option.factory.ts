import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRADIENT_EDGE_SANKEY_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sankey",
  coordinateSystem: "none",
  features: ["gradient"],
  name: "Gradient Edge Sankey",
  selector: "tng-gradient-edge-sankey-chart",
  seriesType: "sankey",
  slug: "gradient-edge-sankey",
});

export type TngGradientEdgeSankeyChartOptionInput = TngCatalogChartOptionInput;

export function createTngGradientEdgeSankeyChartOption(input: TngGradientEdgeSankeyChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRADIENT_EDGE_SANKEY_CHART_PRESET);
}
