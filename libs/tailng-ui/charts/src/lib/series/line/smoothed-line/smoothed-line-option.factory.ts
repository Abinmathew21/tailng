import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SMOOTHED_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["smooth"],
  name: "Smoothed Line",
  selector: "tng-smoothed-line-chart",
  seriesType: "line",
  slug: "smoothed-line",
});

export type TngSmoothedLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngSmoothedLineChartOption(input: TngSmoothedLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SMOOTHED_LINE_CHART_PRESET);
}
