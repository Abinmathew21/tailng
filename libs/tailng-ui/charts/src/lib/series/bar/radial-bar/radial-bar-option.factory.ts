import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_RADIAL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "polar",
  features: ["radial"],
  name: "Radial Bar",
  selector: "tng-radial-bar-chart",
  seriesType: "bar",
  slug: "radial-bar",
});

export type TngRadialBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngRadialBarChartOption(input: TngRadialBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_RADIAL_BAR_CHART_PRESET);
}
