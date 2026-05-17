import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_GRADE_GAUGE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Gauge",
  coordinateSystem: "none",
  features: ["progress"],
  name: "Grade Gauge",
  selector: "tng-grade-gauge-chart",
  seriesType: "gauge",
  slug: "grade-gauge",
});

export type TngGradeGaugeChartOptionInput = TngCatalogChartOptionInput;

export function createTngGradeGaugeChartOption(input: TngGradeGaugeChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_GRADE_GAUGE_CHART_PRESET);
}
