import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_PIE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "none",
  features: [],
  name: "Basic Pie",
  selector: "tng-basic-pie-chart",
  seriesType: "pie",
  slug: "basic-pie",
});

export type TngBasicPieChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicPieChartOption(input: TngBasicPieChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_PIE_CHART_PRESET);
}
