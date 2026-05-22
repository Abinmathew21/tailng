import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_HEATMAP_CALENDAR_HEATMAP_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Heatmap",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Heatmap",
  selector: "tng-heatmap-calendar-heatmap-chart",
  seriesType: "heatmap",
  slug: "calendar-heatmap",
});

export type TngHeatmapCalendarHeatmapChartOptionInput = TngCatalogChartOptionInput;

export function createTngHeatmapCalendarHeatmapChartOption(input: TngHeatmapCalendarHeatmapChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_HEATMAP_CALENDAR_HEATMAP_CHART_PRESET);
}
