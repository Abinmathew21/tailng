import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LEVEL_SANKEY_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sankey",
  coordinateSystem: "none",
  features: ["level"],
  name: "Level Sankey",
  selector: "tng-level-sankey-chart",
  seriesType: "sankey",
  slug: "level-sankey",
});

export type TngLevelSankeyChartOptionInput = TngCatalogChartOptionInput;

export function createTngLevelSankeyChartOption(input: TngLevelSankeyChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LEVEL_SANKEY_CHART_PRESET);
}
