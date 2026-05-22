import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LINES_GEO_LINES_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Lines",
  coordinateSystem: "geo",
  features: ["geo"],
  name: "Geo Lines",
  selector: "tng-lines-geo-lines-chart",
  seriesType: "lines",
  slug: "geo-lines",
});

export type TngLinesGeoLinesChartOptionInput = TngCatalogChartOptionInput;

export function createTngLinesGeoLinesChartOption(input: TngLinesGeoLinesChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LINES_GEO_LINES_CHART_PRESET);
}
