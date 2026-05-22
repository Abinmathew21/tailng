import type { TngChartOption } from '../../../core/chart.types';
import type { TngCatalogChartOptionInput } from '../../catalog/catalog-chart.types';
import { createTngCatalogChartOption, defineTngCatalogChartPreset } from '../../catalog/catalog-option.factory';

export const TNG_IMAGE_SVG_PICTORIAL_BAR_CHART_PRESET = defineTngCatalogChartPreset({
  category: "PictorialBar",
  coordinateSystem: "none",
  features: [],
  name: "Image/SVG Pictorial Bar",
  selector: "tng-image-svg-pictorial-bar-chart",
  seriesType: "pictorialBar",
  slug: "image-svg-pictorial-bar",
});

export type TngImageSvgPictorialBarChartOptionInput = TngCatalogChartOptionInput;

export function createTngImageSvgPictorialBarChartOption(input: TngImageSvgPictorialBarChartOptionInput): TngChartOption {
  return createTngCatalogChartOption(input, TNG_IMAGE_SVG_PICTORIAL_BAR_CHART_PRESET);
}
