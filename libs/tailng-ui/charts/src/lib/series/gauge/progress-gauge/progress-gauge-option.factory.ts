import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_PROGRESS_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["progress"],
  name: "Progress Gauge",
  selector: "tng-progress-gauge-chart",
  seriesType: "gauge",
  slug: "progress-gauge",
});

export type TngProgressGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngProgressGaugeChartOption(input: TngProgressGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_PROGRESS_GAUGE_CHART_PRESET);
}
