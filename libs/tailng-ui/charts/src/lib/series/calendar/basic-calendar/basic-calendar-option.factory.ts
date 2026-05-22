import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_CALENDAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Calendar",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Basic Calendar",
  selector: "tng-basic-calendar-chart",
  seriesType: "custom",
  slug: "basic-calendar",
});

export type TngBasicCalendarChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicCalendarChartOption(input: TngBasicCalendarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_CALENDAR_CHART_PRESET);
}
