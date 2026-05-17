import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_HORIZONTAL_TREE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Tree",
  coordinateSystem: "none",
  features: ["horizontal"],
  name: "Horizontal Tree",
  selector: "tng-horizontal-tree-chart",
  seriesType: "tree",
  slug: "horizontal-tree",
});

export type TngHorizontalTreeChartOptionInput = TngCatalogChartOptionInput;

export function createTngHorizontalTreeChartOption(input: TngHorizontalTreeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_HORIZONTAL_TREE_CHART_PRESET);
}
