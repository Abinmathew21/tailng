import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CHORD_MIN_ANGLE_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Chord",
  coordinateSystem: "none",
  features: [],
  name: "Chord minAngle",
  selector: "tng-chord-min-angle-chart",
  seriesType: "chord",
  slug: "chord-min-angle",
});

export type TngChordMinAngleChartOptionInput = TngCatalogChartOptionInput;

export function createTngChordMinAngleChartOption(input: TngChordMinAngleChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CHORD_MIN_ANGLE_CHART_PRESET);
}
