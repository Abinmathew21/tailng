import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CLOCK_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["clock"],
  name: "Clock Gauge",
  selector: "tng-clock-gauge-chart",
  seriesType: "gauge",
  slug: "clock-gauge",
});

export type TngClockGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngClockGaugeChartOption(input: TngClockGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CLOCK_GAUGE_CHART_PRESET);
}
