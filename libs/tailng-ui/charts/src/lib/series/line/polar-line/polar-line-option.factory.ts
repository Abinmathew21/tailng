import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_POLAR_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "polar",
  features: ["polar"],
  name: "Polar Line",
  selector: "tng-polar-line-chart",
  seriesType: "line",
  slug: "polar-line",
});

export type TngPolarLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngPolarLineChartOption(input: TngPolarLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_POLAR_LINE_CHART_PRESET);
}
