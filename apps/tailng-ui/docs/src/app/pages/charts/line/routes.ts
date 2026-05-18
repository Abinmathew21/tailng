import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('line');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts line series docs are empty.');
}

const LINE_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'line-chart': {
    overview: () =>
      import('./line-chart/sections/overview/line-chart-overview-page.component').then(
        (module) => module.LineChartOverviewPageComponent,
      ),
    api: () =>
      import('./line-chart/sections/api/line-chart-api-page.component').then(
        (module) => module.LineChartApiPageComponent,
      ),
    styling: () =>
      import('./line-chart/sections/styling/line-chart-styling-page.component').then(
        (module) => module.LineChartStylingPageComponent,
      ),
    examples: () =>
      import('./line-chart/sections/examples/line-chart-examples-page.component').then(
        (module) => module.LineChartExamplesPageComponent,
      ),
  },
  'basic-line': {
    overview: () =>
      import('./basic-line/sections/overview/basic-line-overview-page.component').then(
        (module) => module.BasicLineOverviewPageComponent,
      ),
    api: () =>
      import('./basic-line/sections/api/basic-line-api-page.component').then(
        (module) => module.BasicLineApiPageComponent,
      ),
    styling: () =>
      import('./basic-line/sections/styling/basic-line-styling-page.component').then(
        (module) => module.BasicLineStylingPageComponent,
      ),
    examples: () =>
      import('./basic-line/sections/examples/basic-line-examples-page.component').then(
        (module) => module.BasicLineExamplesPageComponent,
      ),
  },
  'dynamic-line': {
    overview: () =>
      import('./dynamic-line/sections/overview/dynamic-line-overview-page.component').then(
        (module) => module.DynamicLineOverviewPageComponent,
      ),
    api: () =>
      import('./dynamic-line/sections/api/dynamic-line-api-page.component').then(
        (module) => module.DynamicLineApiPageComponent,
      ),
    styling: () =>
      import('./dynamic-line/sections/styling/dynamic-line-styling-page.component').then(
        (module) => module.DynamicLineStylingPageComponent,
      ),
    examples: () =>
      import('./dynamic-line/sections/examples/dynamic-line-examples-page.component').then(
        (module) => module.DynamicLineExamplesPageComponent,
      ),
  },
  'interactive-line': {
    overview: () =>
      import('./interactive-line/sections/overview/interactive-line-overview-page.component').then(
        (module) => module.InteractiveLineOverviewPageComponent,
      ),
    api: () =>
      import('./interactive-line/sections/api/interactive-line-api-page.component').then(
        (module) => module.InteractiveLineApiPageComponent,
      ),
    styling: () =>
      import('./interactive-line/sections/styling/interactive-line-styling-page.component').then(
        (module) => module.InteractiveLineStylingPageComponent,
      ),
    examples: () =>
      import('./interactive-line/sections/examples/interactive-line-examples-page.component').then(
        (module) => module.InteractiveLineExamplesPageComponent,
      ),
  },
  'large-scale-line': {
    overview: () =>
      import('./large-scale-line/sections/overview/large-scale-line-overview-page.component').then(
        (module) => module.LargeScaleLineOverviewPageComponent,
      ),
    api: () =>
      import('./large-scale-line/sections/api/large-scale-line-api-page.component').then(
        (module) => module.LargeScaleLineApiPageComponent,
      ),
    styling: () =>
      import('./large-scale-line/sections/styling/large-scale-line-styling-page.component').then(
        (module) => module.LargeScaleLineStylingPageComponent,
      ),
    examples: () =>
      import('./large-scale-line/sections/examples/large-scale-line-examples-page.component').then(
        (module) => module.LargeScaleLineExamplesPageComponent,
      ),
  },
  'line-race': {
    overview: () =>
      import('./line-race/sections/overview/line-race-overview-page.component').then(
        (module) => module.LineRaceOverviewPageComponent,
      ),
    api: () =>
      import('./line-race/sections/api/line-race-api-page.component').then(
        (module) => module.LineRaceApiPageComponent,
      ),
    styling: () =>
      import('./line-race/sections/styling/line-race-styling-page.component').then(
        (module) => module.LineRaceStylingPageComponent,
      ),
    examples: () =>
      import('./line-race/sections/examples/line-race-examples-page.component').then(
        (module) => module.LineRaceExamplesPageComponent,
      ),
  },
  'line-with-mark-lines': {
    overview: () =>
      import('./line-with-mark-lines/sections/overview/line-with-mark-lines-overview-page.component').then(
        (module) => module.LineWithMarkLinesOverviewPageComponent,
      ),
    api: () =>
      import('./line-with-mark-lines/sections/api/line-with-mark-lines-api-page.component').then(
        (module) => module.LineWithMarkLinesApiPageComponent,
      ),
    styling: () =>
      import('./line-with-mark-lines/sections/styling/line-with-mark-lines-styling-page.component').then(
        (module) => module.LineWithMarkLinesStylingPageComponent,
      ),
    examples: () =>
      import('./line-with-mark-lines/sections/examples/line-with-mark-lines-examples-page.component').then(
        (module) => module.LineWithMarkLinesExamplesPageComponent,
      ),
  },
  'log-axis-line': {
    overview: () =>
      import('./log-axis-line/sections/overview/log-axis-line-overview-page.component').then(
        (module) => module.LogAxisLineOverviewPageComponent,
      ),
    api: () =>
      import('./log-axis-line/sections/api/log-axis-line-api-page.component').then(
        (module) => module.LogAxisLineApiPageComponent,
      ),
    styling: () =>
      import('./log-axis-line/sections/styling/log-axis-line-styling-page.component').then(
        (module) => module.LogAxisLineStylingPageComponent,
      ),
    examples: () =>
      import('./log-axis-line/sections/examples/log-axis-line-examples-page.component').then(
        (module) => module.LogAxisLineExamplesPageComponent,
      ),
  },
  'multi-axis-line': {
    overview: () =>
      import('./multi-axis-line/sections/overview/multi-axis-line-overview-page.component').then(
        (module) => module.MultiAxisLineOverviewPageComponent,
      ),
    api: () =>
      import('./multi-axis-line/sections/api/multi-axis-line-api-page.component').then(
        (module) => module.MultiAxisLineApiPageComponent,
      ),
    styling: () =>
      import('./multi-axis-line/sections/styling/multi-axis-line-styling-page.component').then(
        (module) => module.MultiAxisLineStylingPageComponent,
      ),
    examples: () =>
      import('./multi-axis-line/sections/examples/multi-axis-line-examples-page.component').then(
        (module) => module.MultiAxisLineExamplesPageComponent,
      ),
  },
  'polar-line': {
    overview: () =>
      import('./polar-line/sections/overview/polar-line-overview-page.component').then(
        (module) => module.PolarLineOverviewPageComponent,
      ),
    api: () =>
      import('./polar-line/sections/api/polar-line-api-page.component').then(
        (module) => module.PolarLineApiPageComponent,
      ),
    styling: () =>
      import('./polar-line/sections/styling/polar-line-styling-page.component').then(
        (module) => module.PolarLineStylingPageComponent,
      ),
    examples: () =>
      import('./polar-line/sections/examples/polar-line-examples-page.component').then(
        (module) => module.PolarLineExamplesPageComponent,
      ),
  },
  'smoothed-line': {
    overview: () =>
      import('./smoothed-line/sections/overview/smoothed-line-overview-page.component').then(
        (module) => module.SmoothedLineOverviewPageComponent,
      ),
    api: () =>
      import('./smoothed-line/sections/api/smoothed-line-api-page.component').then(
        (module) => module.SmoothedLineApiPageComponent,
      ),
    styling: () =>
      import('./smoothed-line/sections/styling/smoothed-line-styling-page.component').then(
        (module) => module.SmoothedLineStylingPageComponent,
      ),
    examples: () =>
      import('./smoothed-line/sections/examples/smoothed-line-examples-page.component').then(
        (module) => module.SmoothedLineExamplesPageComponent,
      ),
  },
  'sparkline': {
    overview: () =>
      import('./sparkline/sections/overview/sparkline-overview-page.component').then(
        (module) => module.SparklineOverviewPageComponent,
      ),
    api: () =>
      import('./sparkline/sections/api/sparkline-api-page.component').then(
        (module) => module.SparklineApiPageComponent,
      ),
    styling: () =>
      import('./sparkline/sections/styling/sparkline-styling-page.component').then(
        (module) => module.SparklineStylingPageComponent,
      ),
    examples: () =>
      import('./sparkline/sections/examples/sparkline-examples-page.component').then(
        (module) => module.SparklineExamplesPageComponent,
      ),
  },
  'stacked-line': {
    overview: () =>
      import('./stacked-line/sections/overview/stacked-line-overview-page.component').then(
        (module) => module.StackedLineOverviewPageComponent,
      ),
    api: () =>
      import('./stacked-line/sections/api/stacked-line-api-page.component').then(
        (module) => module.StackedLineApiPageComponent,
      ),
    styling: () =>
      import('./stacked-line/sections/styling/stacked-line-styling-page.component').then(
        (module) => module.StackedLineStylingPageComponent,
      ),
    examples: () =>
      import('./stacked-line/sections/examples/stacked-line-examples-page.component').then(
        (module) => module.StackedLineExamplesPageComponent,
      ),
  },
  'step-line': {
    overview: () =>
      import('./step-line/sections/overview/step-line-overview-page.component').then(
        (module) => module.StepLineOverviewPageComponent,
      ),
    api: () =>
      import('./step-line/sections/api/step-line-api-page.component').then(
        (module) => module.StepLineApiPageComponent,
      ),
    styling: () =>
      import('./step-line/sections/styling/step-line-styling-page.component').then(
        (module) => module.StepLineStylingPageComponent,
      ),
    examples: () =>
      import('./step-line/sections/examples/step-line-examples-page.component').then(
        (module) => module.StepLineExamplesPageComponent,
      ),
  },
  'time-series-line': {
    overview: () =>
      import('./time-series-line/sections/overview/time-series-line-overview-page.component').then(
        (module) => module.TimeSeriesLineOverviewPageComponent,
      ),
    api: () =>
      import('./time-series-line/sections/api/time-series-line-api-page.component').then(
        (module) => module.TimeSeriesLineApiPageComponent,
      ),
    styling: () =>
      import('./time-series-line/sections/styling/time-series-line-styling-page.component').then(
        (module) => module.TimeSeriesLineStylingPageComponent,
      ),
    examples: () =>
      import('./time-series-line/sections/examples/time-series-line-examples-page.component').then(
        (module) => module.TimeSeriesLineExamplesPageComponent,
      ),
  },
};

export const CHARTS_LINE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, LINE_CHART_SECTION_LOADERS[item.slug]),
  })),
];
