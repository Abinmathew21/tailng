import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CUSTOMIZED_FUNNEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Funnel",
  coordinateSystem: "none",
  features: [],
  name: "Customized Funnel",
  selector: "tng-customized-funnel-chart",
  seriesType: "funnel",
  slug: "customized-funnel",
});

export type TngCustomizedFunnelChartOptionInput = TngCatalogChartOptionInput;

export function createTngCustomizedFunnelChartOption(input: TngCustomizedFunnelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CUSTOMIZED_FUNNEL_CHART_PRESET);
}
