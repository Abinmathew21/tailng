import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('scatter');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts scatter series docs are empty.');
}

const SCATTER_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'scatter-chart': {
    overview: () =>
      import('./scatter-chart/sections/overview/scatter-chart-overview-page.component').then(
        (module) => module.ScatterChartOverviewPageComponent,
      ),
    api: () =>
      import('./scatter-chart/sections/api/scatter-chart-api-page.component').then(
        (module) => module.ScatterChartApiPageComponent,
      ),
    styling: () =>
      import('./scatter-chart/sections/styling/scatter-chart-styling-page.component').then(
        (module) => module.ScatterChartStylingPageComponent,
      ),
    examples: () =>
      import('./scatter-chart/sections/examples/scatter-chart-examples-page.component').then(
        (module) => module.ScatterChartExamplesPageComponent,
      ),
  },
  'basic-scatter': {
    overview: () =>
      import('./basic-scatter/sections/overview/basic-scatter-overview-page.component').then(
        (module) => module.BasicScatterOverviewPageComponent,
      ),
    api: () =>
      import('./basic-scatter/sections/api/basic-scatter-api-page.component').then(
        (module) => module.BasicScatterApiPageComponent,
      ),
    styling: () =>
      import('./basic-scatter/sections/styling/basic-scatter-styling-page.component').then(
        (module) => module.BasicScatterStylingPageComponent,
      ),
    examples: () =>
      import('./basic-scatter/sections/examples/basic-scatter-examples-page.component').then(
        (module) => module.BasicScatterExamplesPageComponent,
      ),
  },
  'bubble-chart': {
    overview: () =>
      import('./bubble-chart/sections/overview/bubble-chart-overview-page.component').then(
        (module) => module.BubbleChartOverviewPageComponent,
      ),
    api: () =>
      import('./bubble-chart/sections/api/bubble-chart-api-page.component').then(
        (module) => module.BubbleChartApiPageComponent,
      ),
    styling: () =>
      import('./bubble-chart/sections/styling/bubble-chart-styling-page.component').then(
        (module) => module.BubbleChartStylingPageComponent,
      ),
    examples: () =>
      import('./bubble-chart/sections/examples/bubble-chart-examples-page.component').then(
        (module) => module.BubbleChartExamplesPageComponent,
      ),
  },
  'calendar-scatter': {
    overview: () =>
      import('./calendar-scatter/sections/overview/calendar-scatter-overview-page.component').then(
        (module) => module.CalendarScatterOverviewPageComponent,
      ),
    api: () =>
      import('./calendar-scatter/sections/api/calendar-scatter-api-page.component').then(
        (module) => module.CalendarScatterApiPageComponent,
      ),
    styling: () =>
      import('./calendar-scatter/sections/styling/calendar-scatter-styling-page.component').then(
        (module) => module.CalendarScatterStylingPageComponent,
      ),
    examples: () =>
      import('./calendar-scatter/sections/examples/calendar-scatter-examples-page.component').then(
        (module) => module.CalendarScatterExamplesPageComponent,
      ),
  },
  'effect-scatter': {
    overview: () =>
      import('./effect-scatter/sections/overview/effect-scatter-overview-page.component').then(
        (module) => module.EffectScatterOverviewPageComponent,
      ),
    api: () =>
      import('./effect-scatter/sections/api/effect-scatter-api-page.component').then(
        (module) => module.EffectScatterApiPageComponent,
      ),
    styling: () =>
      import('./effect-scatter/sections/styling/effect-scatter-styling-page.component').then(
        (module) => module.EffectScatterStylingPageComponent,
      ),
    examples: () =>
      import('./effect-scatter/sections/examples/effect-scatter-examples-page.component').then(
        (module) => module.EffectScatterExamplesPageComponent,
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
  'jitter-scatter': {
    overview: () =>
      import('./jitter-scatter/sections/overview/jitter-scatter-overview-page.component').then(
        (module) => module.JitterScatterOverviewPageComponent,
      ),
    api: () =>
      import('./jitter-scatter/sections/api/jitter-scatter-api-page.component').then(
        (module) => module.JitterScatterApiPageComponent,
      ),
    styling: () =>
      import('./jitter-scatter/sections/styling/jitter-scatter-styling-page.component').then(
        (module) => module.JitterScatterStylingPageComponent,
      ),
    examples: () =>
      import('./jitter-scatter/sections/examples/jitter-scatter-examples-page.component').then(
        (module) => module.JitterScatterExamplesPageComponent,
      ),
  },
  'large-scatter': {
    overview: () =>
      import('./large-scatter/sections/overview/large-scatter-overview-page.component').then(
        (module) => module.LargeScatterOverviewPageComponent,
      ),
    api: () =>
      import('./large-scatter/sections/api/large-scatter-api-page.component').then(
        (module) => module.LargeScatterApiPageComponent,
      ),
    styling: () =>
      import('./large-scatter/sections/styling/large-scatter-styling-page.component').then(
        (module) => module.LargeScatterStylingPageComponent,
      ),
    examples: () =>
      import('./large-scatter/sections/examples/large-scatter-examples-page.component').then(
        (module) => module.LargeScatterExamplesPageComponent,
      ),
  },
  'regression-scatter': {
    overview: () =>
      import('./regression-scatter/sections/overview/regression-scatter-overview-page.component').then(
        (module) => module.RegressionScatterOverviewPageComponent,
      ),
    api: () =>
      import('./regression-scatter/sections/api/regression-scatter-api-page.component').then(
        (module) => module.RegressionScatterApiPageComponent,
      ),
    styling: () =>
      import('./regression-scatter/sections/styling/regression-scatter-styling-page.component').then(
        (module) => module.RegressionScatterStylingPageComponent,
      ),
    examples: () =>
      import('./regression-scatter/sections/examples/regression-scatter-examples-page.component').then(
        (module) => module.RegressionScatterExamplesPageComponent,
      ),
  },
  'scatter-matrix': {
    overview: () =>
      import('./scatter-matrix/sections/overview/scatter-matrix-overview-page.component').then(
        (module) => module.ScatterMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./scatter-matrix/sections/api/scatter-matrix-api-page.component').then(
        (module) => module.ScatterMatrixApiPageComponent,
      ),
    styling: () =>
      import('./scatter-matrix/sections/styling/scatter-matrix-styling-page.component').then(
        (module) => module.ScatterMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./scatter-matrix/sections/examples/scatter-matrix-examples-page.component').then(
        (module) => module.ScatterMatrixExamplesPageComponent,
      ),
  },
  'single-axis-scatter': {
    overview: () =>
      import('./single-axis-scatter/sections/overview/single-axis-scatter-overview-page.component').then(
        (module) => module.SingleAxisScatterOverviewPageComponent,
      ),
    api: () =>
      import('./single-axis-scatter/sections/api/single-axis-scatter-api-page.component').then(
        (module) => module.SingleAxisScatterApiPageComponent,
      ),
    styling: () =>
      import('./single-axis-scatter/sections/styling/single-axis-scatter-styling-page.component').then(
        (module) => module.SingleAxisScatterStylingPageComponent,
      ),
    examples: () =>
      import('./single-axis-scatter/sections/examples/single-axis-scatter-examples-page.component').then(
        (module) => module.SingleAxisScatterExamplesPageComponent,
      ),
  },
};

export const CHARTS_SCATTER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, SCATTER_CHART_SECTION_LOADERS[item.slug]),
  })),
];
