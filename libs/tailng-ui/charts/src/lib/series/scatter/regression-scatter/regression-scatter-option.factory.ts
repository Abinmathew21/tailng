import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_REGRESSION_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "cartesian2d",
  features: ["regression"],
  name: "Regression Scatter",
  selector: "tng-regression-scatter-chart",
  seriesType: "scatter",
  slug: "regression-scatter",
});

export type TngRegressionScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngRegressionScatterChartOption(input: TngRegressionScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_REGRESSION_SCATTER_CHART_PRESET);
}
