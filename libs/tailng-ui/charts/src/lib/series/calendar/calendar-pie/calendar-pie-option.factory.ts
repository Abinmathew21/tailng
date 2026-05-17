import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CALENDAR_PIE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Calendar",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Pie",
  selector: "tng-calendar-pie-chart",
  seriesType: "pie",
  slug: "calendar-pie",
});

export type TngCalendarPieChartOptionInput = TngCatalogChartOptionInput;

export function createTngCalendarPieChartOption(input: TngCalendarPieChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CALENDAR_PIE_CHART_PRESET);
}
