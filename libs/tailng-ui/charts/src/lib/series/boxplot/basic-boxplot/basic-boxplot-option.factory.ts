import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_BOXPLOT_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Boxplot",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Basic Boxplot",
  selector: "tng-basic-boxplot-chart",
  seriesType: "boxplot",
  slug: "basic-boxplot",
});

export type TngBasicBoxplotChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicBoxplotChartOption(input: TngBasicBoxplotChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_BOXPLOT_CHART_PRESET);
}
