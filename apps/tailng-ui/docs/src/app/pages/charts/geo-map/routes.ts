import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('geo-map');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts geo map series docs are empty.');
}

const GEO_MAP_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'choropleth-map': {
    overview: () =>
      import('./choropleth-map/sections/overview/choropleth-map-overview-page.component').then(
        (module) => module.ChoroplethMapOverviewPageComponent,
      ),
    api: () =>
      import('./choropleth-map/sections/api/choropleth-map-api-page.component').then(
        (module) => module.ChoroplethMapApiPageComponent,
      ),
    styling: () =>
      import('./choropleth-map/sections/styling/choropleth-map-styling-page.component').then(
        (module) => module.ChoroplethMapStylingPageComponent,
      ),
    examples: () =>
      import('./choropleth-map/sections/examples/choropleth-map-examples-page.component').then(
        (module) => module.ChoroplethMapExamplesPageComponent,
      ),
  },
  'geo-lines': {
    overview: () =>
      import('./geo-lines/sections/overview/geo-lines-overview-page.component').then(
        (module) => module.GeoLinesOverviewPageComponent,
      ),
    api: () =>
      import('./geo-lines/sections/api/geo-lines-api-page.component').then(
        (module) => module.GeoLinesApiPageComponent,
      ),
    styling: () =>
      import('./geo-lines/sections/styling/geo-lines-styling-page.component').then(
        (module) => module.GeoLinesStylingPageComponent,
      ),
    examples: () =>
      import('./geo-lines/sections/examples/geo-lines-examples-page.component').then(
        (module) => module.GeoLinesExamplesPageComponent,
      ),
  },
  'geo-map': {
    overview: () =>
      import('./geo-map/sections/overview/geo-map-overview-page.component').then(
        (module) => module.GeoMapOverviewPageComponent,
      ),
    api: () =>
      import('./geo-map/sections/api/geo-map-api-page.component').then(
        (module) => module.GeoMapApiPageComponent,
      ),
    styling: () =>
      import('./geo-map/sections/styling/geo-map-styling-page.component').then(
        (module) => module.GeoMapStylingPageComponent,
      ),
    examples: () =>
      import('./geo-map/sections/examples/geo-map-examples-page.component').then(
        (module) => module.GeoMapExamplesPageComponent,
      ),
  },
  'geo-scatter': {
    overview: () =>
      import('./geo-scatter/sections/overview/geo-scatter-overview-page.component').then(
        (module) => module.GeoScatterOverviewPageComponent,
      ),
    api: () =>
      import('./geo-scatter/sections/api/geo-scatter-api-page.component').then(
        (module) => module.GeoScatterApiPageComponent,
      ),
    styling: () =>
      import('./geo-scatter/sections/styling/geo-scatter-styling-page.component').then(
        (module) => module.GeoScatterStylingPageComponent,
      ),
    examples: () =>
      import('./geo-scatter/sections/examples/geo-scatter-examples-page.component').then(
        (module) => module.GeoScatterExamplesPageComponent,
      ),
  },
  'hexagonal-binning': {
    overview: () =>
      import('./hexagonal-binning/sections/overview/hexagonal-binning-overview-page.component').then(
        (module) => module.HexagonalBinningOverviewPageComponent,
      ),
    api: () =>
      import('./hexagonal-binning/sections/api/hexagonal-binning-api-page.component').then(
        (module) => module.HexagonalBinningApiPageComponent,
      ),
    styling: () =>
      import('./hexagonal-binning/sections/styling/hexagonal-binning-styling-page.component').then(
        (module) => module.HexagonalBinningStylingPageComponent,
      ),
    examples: () =>
      import('./hexagonal-binning/sections/examples/hexagonal-binning-examples-page.component').then(
        (module) => module.HexagonalBinningExamplesPageComponent,
      ),
  },
  'map-to-bar-morph': {
    overview: () =>
      import('./map-to-bar-morph/sections/overview/map-to-bar-morph-overview-page.component').then(
        (module) => module.MapToBarMorphOverviewPageComponent,
      ),
    api: () =>
      import('./map-to-bar-morph/sections/api/map-to-bar-morph-api-page.component').then(
        (module) => module.MapToBarMorphApiPageComponent,
      ),
    styling: () =>
      import('./map-to-bar-morph/sections/styling/map-to-bar-morph-styling-page.component').then(
        (module) => module.MapToBarMorphStylingPageComponent,
      ),
    examples: () =>
      import('./map-to-bar-morph/sections/examples/map-to-bar-morph-examples-page.component').then(
        (module) => module.MapToBarMorphExamplesPageComponent,
      ),
  },
  'svg-map': {
    overview: () =>
      import('./svg-map/sections/overview/svg-map-overview-page.component').then(
        (module) => module.SvgMapOverviewPageComponent,
      ),
    api: () =>
      import('./svg-map/sections/api/svg-map-api-page.component').then(
        (module) => module.SvgMapApiPageComponent,
      ),
    styling: () =>
      import('./svg-map/sections/styling/svg-map-styling-page.component').then(
        (module) => module.SvgMapStylingPageComponent,
      ),
    examples: () =>
      import('./svg-map/sections/examples/svg-map-examples-page.component').then(
        (module) => module.SvgMapExamplesPageComponent,
      ),
  },
};

export const CHARTS_GEO_MAP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, GEO_MAP_CHART_SECTION_LOADERS[item.slug]),
  })),
];
