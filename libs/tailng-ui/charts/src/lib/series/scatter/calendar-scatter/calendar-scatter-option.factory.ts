import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CALENDAR_SCATTER_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Scatter",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Scatter",
  selector: "tng-calendar-scatter-chart",
  seriesType: "scatter",
  slug: "calendar-scatter",
});

export type TngCalendarScatterChartOptionInput = TngCatalogChartOptionInput;

export function createTngCalendarScatterChartOption(input: TngCalendarScatterChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CALENDAR_SCATTER_CHART_PRESET);
}
