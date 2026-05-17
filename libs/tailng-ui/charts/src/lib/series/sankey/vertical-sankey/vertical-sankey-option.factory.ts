import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_VERTICAL_SANKEY_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sankey",
  coordinateSystem: "none",
  features: ["vertical"],
  name: "Vertical Sankey",
  selector: "tng-vertical-sankey-chart",
  seriesType: "sankey",
  slug: "vertical-sankey",
});

export type TngVerticalSankeyChartOptionInput = TngCatalogChartOptionInput;

export function createTngVerticalSankeyChartOption(input: TngVerticalSankeyChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_VERTICAL_SANKEY_CHART_PRESET);
}
