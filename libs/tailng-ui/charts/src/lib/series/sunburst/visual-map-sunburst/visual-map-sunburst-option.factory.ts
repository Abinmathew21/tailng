import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_VISUAL_MAP_SUNBURST_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sunburst",
  coordinateSystem: "geo",
  features: ["visualMap"],
  name: "VisualMap Sunburst",
  selector: "tng-visual-map-sunburst-chart",
  seriesType: "sunburst",
  slug: "visual-map-sunburst",
});

export type TngVisualMapSunburstChartOptionInput = TngCatalogChartOptionInput;

export function createTngVisualMapSunburstChartOption(input: TngVisualMapSunburstChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_VISUAL_MAP_SUNBURST_CHART_PRESET);
}
