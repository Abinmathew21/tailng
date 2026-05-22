import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_STYLED_SANKEY_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sankey",
  coordinateSystem: "none",
  features: [],
  name: "Styled Sankey",
  selector: "tng-styled-sankey-chart",
  seriesType: "sankey",
  slug: "styled-sankey",
});

export type TngStyledSankeyChartOptionInput = TngCatalogChartOptionInput;

export function createTngStyledSankeyChartOption(input: TngStyledSankeyChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_STYLED_SANKEY_CHART_PRESET);
}
