import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_TREE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Tree",
  coordinateSystem: "none",
  features: [],
  name: "Basic Tree",
  selector: "tng-basic-tree-chart",
  seriesType: "tree",
  slug: "basic-tree",
});

export type TngBasicTreeChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicTreeChartOption(input: TngBasicTreeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_TREE_CHART_PRESET);
}
