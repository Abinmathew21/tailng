import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SVG_MAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "GEO/Map",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "SVG Map",
  selector: "tng-svg-map-chart",
  seriesType: "map",
  slug: "svg-map",
});

export type TngSvgMapChartOptionInput = TngCatalogChartOptionInput;

export function createTngSvgMapChartOption(input: TngSvgMapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SVG_MAP_CHART_PRESET);
}
