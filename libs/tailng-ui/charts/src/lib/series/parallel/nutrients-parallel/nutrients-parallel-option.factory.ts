import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_NUTRIENTS_PARALLEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Parallel",
  coordinateSystem: "parallel",
  features: [],
  name: "Nutrients Parallel",
  selector: "tng-nutrients-parallel-chart",
  seriesType: "parallel",
  slug: "nutrients-parallel",
});

export type TngNutrientsParallelChartOptionInput = TngCatalogChartOptionInput;

export function createTngNutrientsParallelChartOption(input: TngNutrientsParallelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_NUTRIENTS_PARALLEL_CHART_PRESET);
}
