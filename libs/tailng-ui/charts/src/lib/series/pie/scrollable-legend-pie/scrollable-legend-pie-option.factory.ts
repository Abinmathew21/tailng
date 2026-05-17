import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SCROLLABLE_LEGEND_PIE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "none",
  features: ["scrollLegend"],
  name: "Scrollable Legend Pie",
  selector: "tng-scrollable-legend-pie-chart",
  seriesType: "pie",
  slug: "scrollable-legend-pie",
});

export type TngScrollableLegendPieChartOptionInput = TngCatalogChartOptionInput;

export function createTngScrollableLegendPieChartOption(input: TngScrollableLegendPieChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SCROLLABLE_LEGEND_PIE_CHART_PRESET);
}
