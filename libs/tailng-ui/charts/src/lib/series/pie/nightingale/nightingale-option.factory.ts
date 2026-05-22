import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_NIGHTINGALE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "none",
  features: ["nightingale"],
  name: "Nightingale",
  selector: "tng-nightingale-chart",
  seriesType: "pie",
  slug: "nightingale",
});

export type TngNightingaleChartOptionInput = TngCatalogChartOptionInput;

export function createTngNightingaleChartOption(input: TngNightingaleChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_NIGHTINGALE_CHART_PRESET);
}
