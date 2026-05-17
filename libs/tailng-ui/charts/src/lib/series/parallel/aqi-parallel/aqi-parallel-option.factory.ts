import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_AQI_PARALLEL_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Parallel",
  coordinateSystem: "parallel",
  features: [],
  name: "AQI Parallel",
  selector: "tng-aqi-parallel-chart",
  seriesType: "parallel",
  slug: "aqi-parallel",
});

export type TngAqiParallelChartOptionInput = TngCatalogChartOptionInput;

export function createTngAqiParallelChartOption(input: TngAqiParallelChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_AQI_PARALLEL_CHART_PRESET);
}
