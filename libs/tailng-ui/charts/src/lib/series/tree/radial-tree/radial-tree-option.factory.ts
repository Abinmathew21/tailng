import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_RADIAL_TREE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Tree",
  coordinateSystem: "polar",
  features: ["radial"],
  name: "Radial Tree",
  selector: "tng-radial-tree-chart",
  seriesType: "tree",
  slug: "radial-tree",
});

export type TngRadialTreeChartOptionInput = TngCatalogChartOptionInput;

export function createTngRadialTreeChartOption(input: TngRadialTreeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_RADIAL_TREE_CHART_PRESET);
}
