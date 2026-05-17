import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_BASIC_CHORD_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Chord",
  coordinateSystem: "none",
  features: [],
  name: "Basic Chord",
  selector: "tng-basic-chord-chart",
  seriesType: "chord",
  slug: "basic-chord",
});

export type TngBasicChordChartOptionInput = TngCatalogChartOptionInput;

export function createTngBasicChordChartOption(input: TngBasicChordChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_BASIC_CHORD_CHART_PRESET);
}
