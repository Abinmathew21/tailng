import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_VERTICAL_TREE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Tree",
  coordinateSystem: "none",
  features: ["vertical"],
  name: "Vertical Tree",
  selector: "tng-vertical-tree-chart",
  seriesType: "tree",
  slug: "vertical-tree",
});

export type TngVerticalTreeChartOptionInput = TngCatalogChartOptionInput;

export function createTngVerticalTreeChartOption(input: TngVerticalTreeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_VERTICAL_TREE_CHART_PRESET);
}
