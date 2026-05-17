import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_DOTTED_PICTORIAL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "PictorialBar",
  coordinateSystem: "none",
  features: [],
  name: "Dotted Pictorial Bar",
  selector: "tng-dotted-pictorial-bar-chart",
  seriesType: "pictorialBar",
  slug: "dotted-pictorial-bar",
});

export type TngDottedPictorialBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngDottedPictorialBarChartOption(input: TngDottedPictorialBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_DOTTED_PICTORIAL_BAR_CHART_PRESET);
}
