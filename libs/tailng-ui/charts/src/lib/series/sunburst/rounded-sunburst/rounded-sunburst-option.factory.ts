import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_ROUNDED_SUNBURST_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sunburst",
  coordinateSystem: "none",
  features: ["rounded"],
  name: "Rounded Sunburst",
  selector: "tng-rounded-sunburst-chart",
  seriesType: "sunburst",
  slug: "rounded-sunburst",
});

export type TngRoundedSunburstChartOptionInput = TngCatalogChartOptionInput;

export function createTngRoundedSunburstChartOption(input: TngRoundedSunburstChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_ROUNDED_SUNBURST_CHART_PRESET);
}
