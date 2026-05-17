import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DONUT_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "none",
  features: ["ring"],
  name: "Donut",
  selector: "tng-donut-chart",
  seriesType: "pie",
  slug: "donut",
});

export type TngDonutChartOptionInput = TngCatalogChartOptionInput;

export function createTngDonutChartOption(input: TngDonutChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DONUT_CHART_PRESET);
}
