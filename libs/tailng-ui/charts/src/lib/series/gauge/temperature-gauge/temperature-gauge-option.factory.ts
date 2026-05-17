import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_TEMPERATURE_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["progress"],
  name: "Temperature Gauge",
  selector: "tng-temperature-gauge-chart",
  seriesType: "gauge",
  slug: "temperature-gauge",
});

export type TngTemperatureGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngTemperatureGaugeChartOption(input: TngTemperatureGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_TEMPERATURE_GAUGE_CHART_PRESET);
}
