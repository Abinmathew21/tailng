import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LOG_AXIS_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["logAxis"],
  name: "Log Axis Line",
  selector: "tng-log-axis-line-chart",
  seriesType: "line",
  slug: "log-axis-line",
});

export type TngLogAxisLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngLogAxisLineChartOption(input: TngLogAxisLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LOG_AXIS_LINE_CHART_PRESET);
}
