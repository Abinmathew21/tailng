import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SPEED_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["progress"],
  name: "Speed Gauge",
  selector: "tng-speed-gauge-chart",
  seriesType: "gauge",
  slug: "speed-gauge",
});

export type TngSpeedGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngSpeedGaugeChartOption(input: TngSpeedGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SPEED_GAUGE_CHART_PRESET);
}
