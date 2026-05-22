import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BAROMETER_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["barometer"],
  name: "Barometer Gauge",
  selector: "tng-barometer-gauge-chart",
  seriesType: "gauge",
  slug: "barometer-gauge",
});

export type TngBarometerGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngBarometerGaugeChartOption(input: TngBarometerGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BAROMETER_GAUGE_CHART_PRESET);
}
