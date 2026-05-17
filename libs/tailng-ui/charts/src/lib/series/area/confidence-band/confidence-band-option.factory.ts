import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CONFIDENCE_BAND_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Area",
  coordinateSystem: "cartesian2d",
  features: ["area","confidenceBand"],
  name: "Confidence Band",
  selector: "tng-confidence-band-chart",
  seriesType: "line",
  slug: "confidence-band",
});

export type TngConfidenceBandChartOptionInput = TngCatalogChartOptionInput;

export function createTngConfidenceBandChartOption(input: TngConfidenceBandChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CONFIDENCE_BAND_CHART_PRESET);
}
