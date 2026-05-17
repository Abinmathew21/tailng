import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Bar",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Basic Bar",
  selector: "tng-basic-bar-chart",
  seriesType: "bar",
  slug: "basic-bar",
});

export type TngBasicBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicBarChartOption(input: TngBasicBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_BAR_CHART_PRESET);
}
