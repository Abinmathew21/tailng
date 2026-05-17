import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_STYLED_CHORD_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Chord",
  coordinateSystem: "none",
  features: [],
  name: "Styled Chord",
  selector: "tng-styled-chord-chart",
  seriesType: "chord",
  slug: "styled-chord",
});

export type TngStyledChordChartOptionInput = TngCatalogChartOptionInput;

export function createTngStyledChordChartOption(input: TngStyledChordChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_STYLED_CHORD_CHART_PRESET);
}
