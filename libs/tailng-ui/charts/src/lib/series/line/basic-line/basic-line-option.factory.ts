import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Basic Line",
  selector: "tng-basic-line-chart",
  seriesType: "line",
  slug: "basic-line",
});

export type TngBasicLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicLineChartOption(input: TngBasicLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_LINE_CHART_PRESET);
}
