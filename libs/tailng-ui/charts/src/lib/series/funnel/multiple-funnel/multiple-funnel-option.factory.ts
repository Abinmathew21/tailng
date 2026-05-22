import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MULTIPLE_FUNNEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Funnel",
  coordinateSystem: "none",
  features: [],
  name: "Multiple Funnel",
  selector: "tng-multiple-funnel-chart",
  seriesType: "funnel",
  slug: "multiple-funnel",
});

export type TngMultipleFunnelChartOptionInput = TngCatalogChartOptionInput;

export function createTngMultipleFunnelChartOption(input: TngMultipleFunnelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MULTIPLE_FUNNEL_CHART_PRESET);
}
