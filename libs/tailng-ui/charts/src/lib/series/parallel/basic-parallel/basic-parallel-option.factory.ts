import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_PARALLEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Parallel",
  coordinateSystem: "parallel",
  features: [],
  name: "Basic Parallel",
  selector: "tng-basic-parallel-chart",
  seriesType: "parallel",
  slug: "basic-parallel",
});

export type TngBasicParallelChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicParallelChartOption(input: TngBasicParallelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_PARALLEL_CHART_PRESET);
}
