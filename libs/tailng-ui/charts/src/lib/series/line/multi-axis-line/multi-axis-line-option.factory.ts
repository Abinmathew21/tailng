import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MULTI_AXIS_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["multiAxis"],
  name: "Multi Axis Line",
  selector: "tng-multi-axis-line-chart",
  seriesType: "line",
  slug: "multi-axis-line",
});

export type TngMultiAxisLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngMultiAxisLineChartOption(input: TngMultiAxisLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MULTI_AXIS_LINE_CHART_PRESET);
}
