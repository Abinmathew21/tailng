import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MAP_TO_BAR_MORPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Map to Bar Morph",
  selector: "tng-map-to-bar-morph-chart",
  seriesType: "bar",
  slug: "map-to-bar-morph",
});

export type TngMapToBarMorphChartOptionInput = TngCatalogChartOptionInput;

export function createTngMapToBarMorphChartOption(input: TngMapToBarMorphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MAP_TO_BAR_MORPH_CHART_PRESET);
}
