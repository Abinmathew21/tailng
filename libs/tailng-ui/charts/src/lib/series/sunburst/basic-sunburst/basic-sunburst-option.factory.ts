import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_SUNBURST_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sunburst",
  coordinateSystem: "none",
  features: [],
  name: "Basic Sunburst",
  selector: "tng-basic-sunburst-chart",
  seriesType: "sunburst",
  slug: "basic-sunburst",
});

export type TngBasicSunburstChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicSunburstChartOption(input: TngBasicSunburstChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_SUNBURST_CHART_PRESET);
}
