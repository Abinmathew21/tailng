import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_PARENT_LABEL_TREEMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Treemap",
  coordinateSystem: "geo",
  features: [],
  name: "Parent Label Treemap",
  selector: "tng-parent-label-treemap-chart",
  seriesType: "treemap",
  slug: "parent-label-treemap",
});

export type TngParentLabelTreemapChartOptionInput = TngCatalogChartOptionInput;

export function createTngParentLabelTreemapChartOption(input: TngParentLabelTreemapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_PARENT_LABEL_TREEMAP_CHART_PRESET);
}
