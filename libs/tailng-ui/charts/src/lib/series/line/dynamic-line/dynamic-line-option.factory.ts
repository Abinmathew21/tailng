import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DYNAMIC_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["dynamic"],
  name: "Dynamic Line",
  selector: "tng-dynamic-line-chart",
  seriesType: "line",
  slug: "dynamic-line",
});

export type TngDynamicLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngDynamicLineChartOption(input: TngDynamicLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DYNAMIC_LINE_CHART_PRESET);
}
