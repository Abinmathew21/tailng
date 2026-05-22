import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_POLAR_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "polar",
  features: ["polar"],
  name: "Polar Bar",
  selector: "tng-polar-bar-chart",
  seriesType: "bar",
  slug: "polar-bar",
});

export type TngPolarBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngPolarBarChartOption(input: TngPolarBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_POLAR_BAR_CHART_PRESET);
}
