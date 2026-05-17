import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_CHORD_LINE_STYLE_COLOR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Chord",
  coordinateSystem: "none",
  features: [],
  name: "Chord lineStyle.color",
  selector: "tng-chord-line-style-color-chart",
  seriesType: "chord",
  slug: "chord-line-style-color",
});

export type TngChordLineStyleColorChartOptionInput = TngCatalogChartOptionInput;

export function createTngChordLineStyleColorChartOption(input: TngChordLineStyleColorChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_CHORD_LINE_STYLE_COLOR_CHART_PRESET);
}
