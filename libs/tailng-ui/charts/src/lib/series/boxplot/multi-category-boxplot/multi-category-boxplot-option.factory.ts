import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MULTI_CATEGORY_BOXPLOT_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Boxplot",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Multi Category Boxplot",
  selector: "tng-multi-category-boxplot-chart",
  seriesType: "boxplot",
  slug: "multi-category-boxplot",
});

export type TngMultiCategoryBoxplotChartOptionInput = TngCatalogChartOptionInput;

export function createTngMultiCategoryBoxplotChartOption(input: TngMultiCategoryBoxplotChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MULTI_CATEGORY_BOXPLOT_CHART_PRESET);
}
