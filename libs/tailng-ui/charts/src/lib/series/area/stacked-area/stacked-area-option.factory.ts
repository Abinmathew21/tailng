import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_STACKED_AREA_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area","stacked"],
  name: "Stacked Area",
  selector: "tng-stacked-area-chart",
  seriesType: "line",
  slug: "stacked-area",
});

export type TngStackedAreaChartOptionInput = TngCatalogChartOptionInput;

export function createTngStackedAreaChartOption(input: TngStackedAreaChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_STACKED_AREA_CHART_PRESET);
}
