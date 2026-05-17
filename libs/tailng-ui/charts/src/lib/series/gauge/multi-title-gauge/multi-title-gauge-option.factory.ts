import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_MULTI_TITLE_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: [],
  name: "Multi Title Gauge",
  selector: "tng-multi-title-gauge-chart",
  seriesType: "gauge",
  slug: "multi-title-gauge",
});

export type TngMultiTitleGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngMultiTitleGaugeChartOption(input: TngMultiTitleGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_MULTI_TITLE_GAUGE_CHART_PRESET);
}
