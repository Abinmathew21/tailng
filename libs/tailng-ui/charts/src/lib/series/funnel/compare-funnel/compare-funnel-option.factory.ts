import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_COMPARE_FUNNEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Funnel",
  coordinateSystem: "none",
  features: [],
  name: "Compare Funnel",
  selector: "tng-compare-funnel-chart",
  seriesType: "funnel",
  slug: "compare-funnel",
});

export type TngCompareFunnelChartOptionInput = TngCatalogChartOptionInput;

export function createTngCompareFunnelChartOption(input: TngCompareFunnelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_COMPARE_FUNNEL_CHART_PRESET);
}
