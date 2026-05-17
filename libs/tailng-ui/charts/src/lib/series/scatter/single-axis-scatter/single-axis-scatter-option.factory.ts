import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SINGLE_AXIS_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Single Axis Scatter",
  selector: "tng-single-axis-scatter-chart",
  seriesType: "scatter",
  slug: "single-axis-scatter",
});

export type TngSingleAxisScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngSingleAxisScatterChartOption(input: TngSingleAxisScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SINGLE_AXIS_SCATTER_CHART_PRESET);
}
