import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_LINE_WITH_MARK_LINES_CHART_PRESET = defineTngCatalogChartPreset({
  category: "Line",
  coordinateSystem: "cartesian2d",
  features: ["markLine"],
  name: "Line with Mark Lines",
  selector: "tng-line-with-mark-lines-chart",
  seriesType: "line",
  slug: "line-with-mark-lines",
});

export type TngLineWithMarkLinesChartOptionInput = TngCatalogChartOptionInput;

export function createTngLineWithMarkLinesChartOption(input: TngLineWithMarkLinesChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_LINE_WITH_MARK_LINES_CHART_PRESET);
}
