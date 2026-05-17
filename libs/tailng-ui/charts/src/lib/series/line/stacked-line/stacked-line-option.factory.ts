import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_STACKED_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["stacked"],
  name: "Stacked Line",
  selector: "tng-stacked-line-chart",
  seriesType: "line",
  slug: "stacked-line",
});

export type TngStackedLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngStackedLineChartOption(input: TngStackedLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_STACKED_LINE_CHART_PRESET);
}
