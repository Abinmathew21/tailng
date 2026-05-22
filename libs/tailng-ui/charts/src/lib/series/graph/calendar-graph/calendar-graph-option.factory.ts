import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRAPH_CALENDAR_GRAPH_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Graph",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Graph",
  selector: "tng-graph-calendar-graph-chart",
  seriesType: "graph",
  slug: "calendar-graph",
});

export type TngGraphCalendarGraphChartOptionInput = TngCatalogChartOptionInput;

export function createTngGraphCalendarGraphChartOption(input: TngGraphCalendarGraphChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRAPH_CALENDAR_GRAPH_CHART_PRESET);
}
