import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CALENDAR_ICON_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Calendar",
  coordinateSystem: "calendar",
  features: ["calendar"],
  name: "Calendar Icon",
  selector: "tng-calendar-icon-chart",
  seriesType: "custom",
  slug: "calendar-icon",
});

export type TngCalendarIconChartOptionInput = TngCatalogChartOptionInput;

export function createTngCalendarIconChartOption(input: TngCalendarIconChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CALENDAR_ICON_CHART_PRESET);
}
