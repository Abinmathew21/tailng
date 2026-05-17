import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_ROTATED_LABEL_SUNBURST_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Sunburst",
  coordinateSystem: "none",
  features: [],
  name: "Rotated Label Sunburst",
  selector: "tng-rotated-label-sunburst-chart",
  seriesType: "sunburst",
  slug: "rotated-label-sunburst",
});

export type TngRotatedLabelSunburstChartOptionInput = TngCatalogChartOptionInput;

export function createTngRotatedLabelSunburstChartOption(input: TngRotatedLabelSunburstChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_ROTATED_LABEL_SUNBURST_CHART_PRESET);
}
