import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_RING_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["ring"],
  name: "Ring Gauge",
  selector: "tng-ring-gauge-chart",
  seriesType: "gauge",
  slug: "ring-gauge",
});

export type TngRingGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngRingGaugeChartOption(input: TngRingGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_RING_GAUGE_CHART_PRESET);
}
