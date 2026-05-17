import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_HORIZONTAL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["horizontal"],
  name: "Horizontal Bar",
  selector: "tng-horizontal-bar-chart",
  seriesType: "bar",
  slug: "horizontal-bar",
});

export type TngHorizontalBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngHorizontalBarChartOption(input: TngHorizontalBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_HORIZONTAL_BAR_CHART_PRESET);
}
