import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Basic Scatter",
  selector: "tng-basic-scatter-chart",
  seriesType: "scatter",
  slug: "basic-scatter",
});

export type TngBasicScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicScatterChartOption(input: TngBasicScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_SCATTER_CHART_PRESET);
}
