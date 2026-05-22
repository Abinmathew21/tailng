import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CALENDAR_CALENDAR_HEATMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Calendar",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Heatmap",
  selector: "tng-calendar-calendar-heatmap-chart",
  seriesType: "heatmap",
  slug: "calendar-heatmap",
});

export type TngCalendarCalendarHeatmapChartOptionInput = TngCatalogChartOptionInput;

export function createTngCalendarCalendarHeatmapChartOption(input: TngCalendarCalendarHeatmapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CALENDAR_CALENDAR_HEATMAP_CHART_PRESET);
}
