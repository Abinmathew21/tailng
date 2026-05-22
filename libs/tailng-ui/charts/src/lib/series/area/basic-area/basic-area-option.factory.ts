import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_AREA_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area"],
  name: "Basic Area",
  selector: "tng-basic-area-chart",
  seriesType: "line",
  slug: "basic-area",
});

export type TngBasicAreaChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicAreaChartOption(input: TngBasicAreaChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_AREA_CHART_PRESET);
}
