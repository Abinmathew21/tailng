import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CALENDAR_CALENDAR_GRAPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Calendar",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Graph",
  selector: "tng-calendar-calendar-graph-chart",
  seriesType: "graph",
  slug: "calendar-graph",
});

export type TngCalendarCalendarGraphChartOptionInput = TngCatalogChartOptionInput;

export function createTngCalendarCalendarGraphChartOption(input: TngCalendarCalendarGraphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CALENDAR_CALENDAR_GRAPH_CHART_PRESET);
}
