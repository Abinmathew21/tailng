import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('calendar');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts calendar series docs are empty.');
}

const CALENDAR_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-calendar': {
    overview: () =>
      import('./basic-calendar/sections/overview/basic-calendar-overview-page.component').then(
        (module) => module.BasicCalendarOverviewPageComponent,
      ),
    api: () =>
      import('./basic-calendar/sections/api/basic-calendar-api-page.component').then(
        (module) => module.BasicCalendarApiPageComponent,
      ),
    styling: () =>
      import('./basic-calendar/sections/styling/basic-calendar-styling-page.component').then(
        (module) => module.BasicCalendarStylingPageComponent,
      ),
    examples: () =>
      import('./basic-calendar/sections/examples/basic-calendar-examples-page.component').then(
        (module) => module.BasicCalendarExamplesPageComponent,
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
  'calendar-heatmap': {
    overview: () =>
      import('./calendar-heatmap/sections/overview/calendar-heatmap-overview-page.component').then(
        (module) => module.CalendarHeatmapOverviewPageComponent,
      ),
    api: () =>
      import('./calendar-heatmap/sections/api/calendar-heatmap-api-page.component').then(
        (module) => module.CalendarHeatmapApiPageComponent,
      ),
    styling: () =>
      import('./calendar-heatmap/sections/styling/calendar-heatmap-styling-page.component').then(
        (module) => module.CalendarHeatmapStylingPageComponent,
      ),
    examples: () =>
      import('./calendar-heatmap/sections/examples/calendar-heatmap-examples-page.component').then(
        (module) => module.CalendarHeatmapExamplesPageComponent,
      ),
  },
  'calendar-icon': {
    overview: () =>
      import('./calendar-icon/sections/overview/calendar-icon-overview-page.component').then(
        (module) => module.CalendarIconOverviewPageComponent,
      ),
    api: () =>
      import('./calendar-icon/sections/api/calendar-icon-api-page.component').then(
        (module) => module.CalendarIconApiPageComponent,
      ),
    styling: () =>
      import('./calendar-icon/sections/styling/calendar-icon-styling-page.component').then(
        (module) => module.CalendarIconStylingPageComponent,
      ),
    examples: () =>
      import('./calendar-icon/sections/examples/calendar-icon-examples-page.component').then(
        (module) => module.CalendarIconExamplesPageComponent,
      ),
  },
  'calendar-pie': {
    overview: () =>
      import('./calendar-pie/sections/overview/calendar-pie-overview-page.component').then(
        (module) => module.CalendarPieOverviewPageComponent,
      ),
    api: () =>
      import('./calendar-pie/sections/api/calendar-pie-api-page.component').then(
        (module) => module.CalendarPieApiPageComponent,
      ),
    styling: () =>
      import('./calendar-pie/sections/styling/calendar-pie-styling-page.component').then(
        (module) => module.CalendarPieStylingPageComponent,
      ),
    examples: () =>
      import('./calendar-pie/sections/examples/calendar-pie-examples-page.component').then(
        (module) => module.CalendarPieExamplesPageComponent,
      ),
  },
};

export const CHARTS_CALENDAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, CALENDAR_CHART_SECTION_LOADERS[item.slug]),
  })),
];
