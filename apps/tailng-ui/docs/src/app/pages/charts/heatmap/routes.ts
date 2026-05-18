import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('heatmap');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts heatmap series docs are empty.');
}

const HEATMAP_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'heatmap-chart': {
    overview: () =>
      import('./heatmap-chart/sections/overview/heatmap-chart-overview-page.component').then(
        (module) => module.HeatmapChartOverviewPageComponent,
      ),
    api: () =>
      import('./heatmap-chart/sections/api/heatmap-chart-api-page.component').then(
        (module) => module.HeatmapChartApiPageComponent,
      ),
    styling: () =>
      import('./heatmap-chart/sections/styling/heatmap-chart-styling-page.component').then(
        (module) => module.HeatmapChartStylingPageComponent,
      ),
    examples: () =>
      import('./heatmap-chart/sections/examples/heatmap-chart-examples-page.component').then(
        (module) => module.HeatmapChartExamplesPageComponent,
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
  'cartesian-heatmap': {
    overview: () =>
      import('./cartesian-heatmap/sections/overview/cartesian-heatmap-overview-page.component').then(
        (module) => module.CartesianHeatmapOverviewPageComponent,
      ),
    api: () =>
      import('./cartesian-heatmap/sections/api/cartesian-heatmap-api-page.component').then(
        (module) => module.CartesianHeatmapApiPageComponent,
      ),
    styling: () =>
      import('./cartesian-heatmap/sections/styling/cartesian-heatmap-styling-page.component').then(
        (module) => module.CartesianHeatmapStylingPageComponent,
      ),
    examples: () =>
      import('./cartesian-heatmap/sections/examples/cartesian-heatmap-examples-page.component').then(
        (module) => module.CartesianHeatmapExamplesPageComponent,
      ),
  },
  'discrete-color-heatmap': {
    overview: () =>
      import('./discrete-color-heatmap/sections/overview/discrete-color-heatmap-overview-page.component').then(
        (module) => module.DiscreteColorHeatmapOverviewPageComponent,
      ),
    api: () =>
      import('./discrete-color-heatmap/sections/api/discrete-color-heatmap-api-page.component').then(
        (module) => module.DiscreteColorHeatmapApiPageComponent,
      ),
    styling: () =>
      import('./discrete-color-heatmap/sections/styling/discrete-color-heatmap-styling-page.component').then(
        (module) => module.DiscreteColorHeatmapStylingPageComponent,
      ),
    examples: () =>
      import('./discrete-color-heatmap/sections/examples/discrete-color-heatmap-examples-page.component').then(
        (module) => module.DiscreteColorHeatmapExamplesPageComponent,
      ),
  },
  'large-heatmap': {
    overview: () =>
      import('./large-heatmap/sections/overview/large-heatmap-overview-page.component').then(
        (module) => module.LargeHeatmapOverviewPageComponent,
      ),
    api: () =>
      import('./large-heatmap/sections/api/large-heatmap-api-page.component').then(
        (module) => module.LargeHeatmapApiPageComponent,
      ),
    styling: () =>
      import('./large-heatmap/sections/styling/large-heatmap-styling-page.component').then(
        (module) => module.LargeHeatmapStylingPageComponent,
      ),
    examples: () =>
      import('./large-heatmap/sections/examples/large-heatmap-examples-page.component').then(
        (module) => module.LargeHeatmapExamplesPageComponent,
      ),
  },
  'matrix-heatmap': {
    overview: () =>
      import('./matrix-heatmap/sections/overview/matrix-heatmap-overview-page.component').then(
        (module) => module.MatrixHeatmapOverviewPageComponent,
      ),
    api: () =>
      import('./matrix-heatmap/sections/api/matrix-heatmap-api-page.component').then(
        (module) => module.MatrixHeatmapApiPageComponent,
      ),
    styling: () =>
      import('./matrix-heatmap/sections/styling/matrix-heatmap-styling-page.component').then(
        (module) => module.MatrixHeatmapStylingPageComponent,
      ),
    examples: () =>
      import('./matrix-heatmap/sections/examples/matrix-heatmap-examples-page.component').then(
        (module) => module.MatrixHeatmapExamplesPageComponent,
      ),
  },
};

export const CHARTS_HEATMAP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, HEATMAP_CHART_SECTION_LOADERS[item.slug]),
  })),
];
