import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MONOCHROME_SUNBURST_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sunburst",
  coordinateSystem: "none",
  features: [],
  name: "Monochrome Sunburst",
  selector: "tng-monochrome-sunburst-chart",
  seriesType: "sunburst",
  slug: "monochrome-sunburst",
});

export type TngMonochromeSunburstChartOptionInput = TngCatalogChartOptionInput;

export function createTngMonochromeSunburstChartOption(input: TngMonochromeSunburstChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MONOCHROME_SUNBURST_CHART_PRESET);
}
