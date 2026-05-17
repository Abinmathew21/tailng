import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_TREEMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Treemap",
  coordinateSystem: "geo",
  features: [],
  name: "Basic Treemap",
  selector: "tng-basic-treemap-chart",
  seriesType: "treemap",
  slug: "basic-treemap",
});

export type TngBasicTreemapChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicTreemapChartOption(input: TngBasicTreemapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_TREEMAP_CHART_PRESET);
}
