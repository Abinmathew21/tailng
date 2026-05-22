import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('graph');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts graph series docs are empty.');
}

const GRAPH_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-graph': {
    overview: () =>
      import('./basic-graph/sections/overview/basic-graph-overview-page.component').then(
        (module) => module.BasicGraphOverviewPageComponent,
      ),
    api: () =>
      import('./basic-graph/sections/api/basic-graph-api-page.component').then(
        (module) => module.BasicGraphApiPageComponent,
      ),
    styling: () =>
      import('./basic-graph/sections/styling/basic-graph-styling-page.component').then(
        (module) => module.BasicGraphStylingPageComponent,
      ),
    examples: () =>
      import('./basic-graph/sections/examples/basic-graph-examples-page.component').then(
        (module) => module.BasicGraphExamplesPageComponent,
      ),
  },
  'calendar-graph': {
    overview: () =>
      import('./calendar-graph/sections/overview/calendar-graph-overview-page.component').then(
        (module) => module.CalendarGraphOverviewPageComponent,
      ),
    api: () =>
      import('./calendar-graph/sections/api/calendar-graph-api-page.component').then(
        (module) => module.CalendarGraphApiPageComponent,
      ),
    styling: () =>
      import('./calendar-graph/sections/styling/calendar-graph-styling-page.component').then(
        (module) => module.CalendarGraphStylingPageComponent,
      ),
    examples: () =>
      import('./calendar-graph/sections/examples/calendar-graph-examples-page.component').then(
        (module) => module.CalendarGraphExamplesPageComponent,
      ),
  },
  'dynamic-graph': {
    overview: () =>
      import('./dynamic-graph/sections/overview/dynamic-graph-overview-page.component').then(
        (module) => module.DynamicGraphOverviewPageComponent,
      ),
    api: () =>
      import('./dynamic-graph/sections/api/dynamic-graph-api-page.component').then(
        (module) => module.DynamicGraphApiPageComponent,
      ),
    styling: () =>
      import('./dynamic-graph/sections/styling/dynamic-graph-styling-page.component').then(
        (module) => module.DynamicGraphStylingPageComponent,
      ),
    examples: () =>
      import('./dynamic-graph/sections/examples/dynamic-graph-examples-page.component').then(
        (module) => module.DynamicGraphExamplesPageComponent,
      ),
  },
  'force-graph': {
    overview: () =>
      import('./force-graph/sections/overview/force-graph-overview-page.component').then(
        (module) => module.ForceGraphOverviewPageComponent,
      ),
    api: () =>
      import('./force-graph/sections/api/force-graph-api-page.component').then(
        (module) => module.ForceGraphApiPageComponent,
      ),
    styling: () =>
      import('./force-graph/sections/styling/force-graph-styling-page.component').then(
        (module) => module.ForceGraphStylingPageComponent,
      ),
    examples: () =>
      import('./force-graph/sections/examples/force-graph-examples-page.component').then(
        (module) => module.ForceGraphExamplesPageComponent,
      ),
  },
  'geo-graph': {
    overview: () =>
      import('./geo-graph/sections/overview/geo-graph-overview-page.component').then(
        (module) => module.GeoGraphOverviewPageComponent,
      ),
    api: () =>
      import('./geo-graph/sections/api/geo-graph-api-page.component').then(
        (module) => module.GeoGraphApiPageComponent,
      ),
    styling: () =>
      import('./geo-graph/sections/styling/geo-graph-styling-page.component').then(
        (module) => module.GeoGraphStylingPageComponent,
      ),
    examples: () =>
      import('./geo-graph/sections/examples/geo-graph-examples-page.component').then(
        (module) => module.GeoGraphExamplesPageComponent,
      ),
  },
  'graph-on-cartesian': {
    overview: () =>
      import('./graph-on-cartesian/sections/overview/graph-on-cartesian-overview-page.component').then(
        (module) => module.GraphOnCartesianOverviewPageComponent,
      ),
    api: () =>
      import('./graph-on-cartesian/sections/api/graph-on-cartesian-api-page.component').then(
        (module) => module.GraphOnCartesianApiPageComponent,
      ),
    styling: () =>
      import('./graph-on-cartesian/sections/styling/graph-on-cartesian-styling-page.component').then(
        (module) => module.GraphOnCartesianStylingPageComponent,
      ),
    examples: () =>
      import('./graph-on-cartesian/sections/examples/graph-on-cartesian-examples-page.component').then(
        (module) => module.GraphOnCartesianExamplesPageComponent,
      ),
  },
};

export const CHARTS_GRAPH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, GRAPH_CHART_SECTION_LOADERS[item.slug]),
  })),
];
