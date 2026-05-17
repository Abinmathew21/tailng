import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_NODE_ALIGNED_SANKEY_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sankey",
  coordinateSystem: "none",
  features: [],
  name: "Node Aligned Sankey",
  selector: "tng-node-aligned-sankey-chart",
  seriesType: "sankey",
  slug: "node-aligned-sankey",
});

export type TngNodeAlignedSankeyChartOptionInput = TngCatalogChartOptionInput;

export function createTngNodeAlignedSankeyChartOption(input: TngNodeAlignedSankeyChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_NODE_ALIGNED_SANKEY_CHART_PRESET);
}
