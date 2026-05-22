import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_PIE_ON_CALENDAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Pie",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Pie on Calendar",
  selector: "tng-pie-on-calendar-chart",
  seriesType: "pie",
  slug: "pie-on-calendar",
});

export type TngPieOnCalendarChartOptionInput = TngCatalogChartOptionInput;

export function createTngPieOnCalendarChartOption(input: TngPieOnCalendarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_PIE_ON_CALENDAR_CHART_PRESET);
}
