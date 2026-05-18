import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('lines');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts lines series docs are empty.');
}

const LINES_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
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
  'large-scale-lines': {
    overview: () =>
      import('./large-scale-lines/sections/overview/large-scale-lines-overview-page.component').then(
        (module) => module.LargeScaleLinesOverviewPageComponent,
      ),
    api: () =>
      import('./large-scale-lines/sections/api/large-scale-lines-api-page.component').then(
        (module) => module.LargeScaleLinesApiPageComponent,
      ),
    styling: () =>
      import('./large-scale-lines/sections/styling/large-scale-lines-styling-page.component').then(
        (module) => module.LargeScaleLinesStylingPageComponent,
      ),
    examples: () =>
      import('./large-scale-lines/sections/examples/large-scale-lines-examples-page.component').then(
        (module) => module.LargeScaleLinesExamplesPageComponent,
      ),
  },
};

export const CHARTS_LINES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, LINES_CHART_SECTION_LOADERS[item.slug]),
  })),
];
