import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_PICTORIAL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "PictorialBar",
  coordinateSystem: "none",
  features: [],
  name: "Basic Pictorial Bar",
  selector: "tng-basic-pictorial-bar-chart",
  seriesType: "pictorialBar",
  slug: "basic-pictorial-bar",
});

export type TngBasicPictorialBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicPictorialBarChartOption(input: TngBasicPictorialBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_PICTORIAL_BAR_CHART_PRESET);
}
