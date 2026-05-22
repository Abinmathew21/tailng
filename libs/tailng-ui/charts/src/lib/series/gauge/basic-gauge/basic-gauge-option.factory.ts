import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: [],
  name: "Basic Gauge",
  selector: "tng-basic-gauge-chart",
  seriesType: "gauge",
  slug: "basic-gauge",
});

export type TngBasicGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicGaugeChartOption(input: TngBasicGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_GAUGE_CHART_PRESET);
}
