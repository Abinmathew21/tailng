import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_FUNNEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Funnel",
  coordinateSystem: "none",
  features: [],
  name: "Basic Funnel",
  selector: "tng-basic-funnel-chart",
  seriesType: "funnel",
  slug: "basic-funnel",
});

export type TngBasicFunnelChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicFunnelChartOption(input: TngBasicFunnelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_FUNNEL_CHART_PRESET);
}
