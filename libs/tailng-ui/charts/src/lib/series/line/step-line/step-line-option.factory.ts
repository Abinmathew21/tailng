import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_STEP_LINE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["step"],
  name: "Step Line",
  selector: "tng-step-line-chart",
  seriesType: "line",
  slug: "step-line",
});

export type TngStepLineChartOptionInput = TngCatalogChartOptionInput;

export function createTngStepLineChartOption(input: TngStepLineChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_STEP_LINE_CHART_PRESET);
}
