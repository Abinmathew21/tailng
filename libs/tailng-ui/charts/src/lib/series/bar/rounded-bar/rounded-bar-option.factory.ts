import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_ROUNDED_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: ["rounded"],
  name: "Rounded Bar",
  selector: "tng-rounded-bar-chart",
  seriesType: "bar",
  slug: "rounded-bar",
});

export type TngRoundedBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngRoundedBarChartOption(input: TngRoundedBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_ROUNDED_BAR_CHART_PRESET);
}
