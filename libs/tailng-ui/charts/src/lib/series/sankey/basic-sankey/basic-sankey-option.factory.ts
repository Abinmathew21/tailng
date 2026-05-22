import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_SANKEY_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sankey",
  coordinateSystem: "none",
  features: [],
  name: "Basic Sankey",
  selector: "tng-basic-sankey-chart",
  seriesType: "sankey",
  slug: "basic-sankey",
});

export type TngBasicSankeyChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicSankeyChartOption(input: TngBasicSankeyChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_SANKEY_CHART_PRESET);
}
