import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_ROUNDED_DONUT_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "none",
  features: ["ring","rounded"],
  name: "Rounded Donut",
  selector: "tng-rounded-donut-chart",
  seriesType: "pie",
  slug: "rounded-donut",
});

export type TngRoundedDonutChartOptionInput = TngCatalogChartOptionInput;

export function createTngRoundedDonutChartOption(input: TngRoundedDonutChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_ROUNDED_DONUT_CHART_PRESET);
}
