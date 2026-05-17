import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_INTERACTIVE_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Interactive Line",
  selector: "tng-interactive-line-chart",
  seriesType: "line",
  slug: "interactive-line",
});

export type TngInteractiveLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngInteractiveLineChartOption(input: TngInteractiveLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_INTERACTIVE_LINE_CHART_PRESET);
}
