import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_SPARKLINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: [],
  name: "Sparkline",
  selector: "tng-sparkline-chart",
  seriesType: "line",
  slug: "sparkline",
});

export type TngSparklineChartOptionInput = TngCatalogChartOptionInput;

export function createTngSparklineChartOption(input: TngSparklineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_SPARKLINE_CHART_PRESET);
}
