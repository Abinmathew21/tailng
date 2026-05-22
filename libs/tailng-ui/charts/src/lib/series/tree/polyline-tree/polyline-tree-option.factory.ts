import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_POLYLINE_TREE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Tree",
  coordinateSystem: "none",
  features: [],
  name: "Polyline Tree",
  selector: "tng-polyline-tree-chart",
  seriesType: "tree",
  slug: "polyline-tree",
});

export type TngPolylineTreeChartOptionInput = TngCatalogChartOptionInput;

export function createTngPolylineTreeChartOption(input: TngPolylineTreeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_POLYLINE_TREE_CHART_PRESET);
}
