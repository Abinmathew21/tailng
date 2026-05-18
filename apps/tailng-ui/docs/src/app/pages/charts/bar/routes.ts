import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('bar');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts bar series docs are empty.');
}

const BAR_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'bar-chart': {
    overview: () =>
      import('./bar-chart/sections/overview/bar-chart-overview-page.component').then(
        (module) => module.BarChartOverviewPageComponent,
      ),
    api: () =>
      import('./bar-chart/sections/api/bar-chart-api-page.component').then(
        (module) => module.BarChartApiPageComponent,
      ),
    styling: () =>
      import('./bar-chart/sections/styling/bar-chart-styling-page.component').then(
        (module) => module.BarChartStylingPageComponent,
      ),
    examples: () =>
      import('./bar-chart/sections/examples/bar-chart-examples-page.component').then(
        (module) => module.BarChartExamplesPageComponent,
      ),
  },
  'bar-race': {
    overview: () =>
      import('./bar-race/sections/overview/bar-race-overview-page.component').then(
        (module) => module.BarRaceOverviewPageComponent,
      ),
    api: () =>
      import('./bar-race/sections/api/bar-race-api-page.component').then(
        (module) => module.BarRaceApiPageComponent,
      ),
    styling: () =>
      import('./bar-race/sections/styling/bar-race-styling-page.component').then(
        (module) => module.BarRaceStylingPageComponent,
      ),
    examples: () =>
      import('./bar-race/sections/examples/bar-race-examples-page.component').then(
        (module) => module.BarRaceExamplesPageComponent,
      ),
  },
  'basic-bar': {
    overview: () =>
      import('./basic-bar/sections/overview/basic-bar-overview-page.component').then(
        (module) => module.BasicBarOverviewPageComponent,
      ),
    api: () =>
      import('./basic-bar/sections/api/basic-bar-api-page.component').then(
        (module) => module.BasicBarApiPageComponent,
      ),
    styling: () =>
      import('./basic-bar/sections/styling/basic-bar-styling-page.component').then(
        (module) => module.BasicBarStylingPageComponent,
      ),
    examples: () =>
      import('./basic-bar/sections/examples/basic-bar-examples-page.component').then(
        (module) => module.BasicBarExamplesPageComponent,
      ),
  },
  'drilldown-bar': {
    overview: () =>
      import('./drilldown-bar/sections/overview/drilldown-bar-overview-page.component').then(
        (module) => module.DrilldownBarOverviewPageComponent,
      ),
    api: () =>
      import('./drilldown-bar/sections/api/drilldown-bar-api-page.component').then(
        (module) => module.DrilldownBarApiPageComponent,
      ),
    styling: () =>
      import('./drilldown-bar/sections/styling/drilldown-bar-styling-page.component').then(
        (module) => module.DrilldownBarStylingPageComponent,
      ),
    examples: () =>
      import('./drilldown-bar/sections/examples/drilldown-bar-examples-page.component').then(
        (module) => module.DrilldownBarExamplesPageComponent,
      ),
  },
  'dynamic-bar': {
    overview: () =>
      import('./dynamic-bar/sections/overview/dynamic-bar-overview-page.component').then(
        (module) => module.DynamicBarOverviewPageComponent,
      ),
    api: () =>
      import('./dynamic-bar/sections/api/dynamic-bar-api-page.component').then(
        (module) => module.DynamicBarApiPageComponent,
      ),
    styling: () =>
      import('./dynamic-bar/sections/styling/dynamic-bar-styling-page.component').then(
        (module) => module.DynamicBarStylingPageComponent,
      ),
    examples: () =>
      import('./dynamic-bar/sections/examples/dynamic-bar-examples-page.component').then(
        (module) => module.DynamicBarExamplesPageComponent,
      ),
  },
  'grouped-bar': {
    overview: () =>
      import('./grouped-bar/sections/overview/grouped-bar-overview-page.component').then(
        (module) => module.GroupedBarOverviewPageComponent,
      ),
    api: () =>
      import('./grouped-bar/sections/api/grouped-bar-api-page.component').then(
        (module) => module.GroupedBarApiPageComponent,
      ),
    styling: () =>
      import('./grouped-bar/sections/styling/grouped-bar-styling-page.component').then(
        (module) => module.GroupedBarStylingPageComponent,
      ),
    examples: () =>
      import('./grouped-bar/sections/examples/grouped-bar-examples-page.component').then(
        (module) => module.GroupedBarExamplesPageComponent,
      ),
  },
  'horizontal-bar': {
    overview: () =>
      import('./horizontal-bar/sections/overview/horizontal-bar-overview-page.component').then(
        (module) => module.HorizontalBarOverviewPageComponent,
      ),
    api: () =>
      import('./horizontal-bar/sections/api/horizontal-bar-api-page.component').then(
        (module) => module.HorizontalBarApiPageComponent,
      ),
    styling: () =>
      import('./horizontal-bar/sections/styling/horizontal-bar-styling-page.component').then(
        (module) => module.HorizontalBarStylingPageComponent,
      ),
    examples: () =>
      import('./horizontal-bar/sections/examples/horizontal-bar-examples-page.component').then(
        (module) => module.HorizontalBarExamplesPageComponent,
      ),
  },
  'large-scale-bar': {
    overview: () =>
      import('./large-scale-bar/sections/overview/large-scale-bar-overview-page.component').then(
        (module) => module.LargeScaleBarOverviewPageComponent,
      ),
    api: () =>
      import('./large-scale-bar/sections/api/large-scale-bar-api-page.component').then(
        (module) => module.LargeScaleBarApiPageComponent,
      ),
    styling: () =>
      import('./large-scale-bar/sections/styling/large-scale-bar-styling-page.component').then(
        (module) => module.LargeScaleBarStylingPageComponent,
      ),
    examples: () =>
      import('./large-scale-bar/sections/examples/large-scale-bar-examples-page.component').then(
        (module) => module.LargeScaleBarExamplesPageComponent,
      ),
  },
  'negative-bar': {
    overview: () =>
      import('./negative-bar/sections/overview/negative-bar-overview-page.component').then(
        (module) => module.NegativeBarOverviewPageComponent,
      ),
    api: () =>
      import('./negative-bar/sections/api/negative-bar-api-page.component').then(
        (module) => module.NegativeBarApiPageComponent,
      ),
    styling: () =>
      import('./negative-bar/sections/styling/negative-bar-styling-page.component').then(
        (module) => module.NegativeBarStylingPageComponent,
      ),
    examples: () =>
      import('./negative-bar/sections/examples/negative-bar-examples-page.component').then(
        (module) => module.NegativeBarExamplesPageComponent,
      ),
  },
  'normalized-stacked-bar': {
    overview: () =>
      import('./normalized-stacked-bar/sections/overview/normalized-stacked-bar-overview-page.component').then(
        (module) => module.NormalizedStackedBarOverviewPageComponent,
      ),
    api: () =>
      import('./normalized-stacked-bar/sections/api/normalized-stacked-bar-api-page.component').then(
        (module) => module.NormalizedStackedBarApiPageComponent,
      ),
    styling: () =>
      import('./normalized-stacked-bar/sections/styling/normalized-stacked-bar-styling-page.component').then(
        (module) => module.NormalizedStackedBarStylingPageComponent,
      ),
    examples: () =>
      import('./normalized-stacked-bar/sections/examples/normalized-stacked-bar-examples-page.component').then(
        (module) => module.NormalizedStackedBarExamplesPageComponent,
      ),
  },
  'polar-bar': {
    overview: () =>
      import('./polar-bar/sections/overview/polar-bar-overview-page.component').then(
        (module) => module.PolarBarOverviewPageComponent,
      ),
    api: () =>
      import('./polar-bar/sections/api/polar-bar-api-page.component').then(
        (module) => module.PolarBarApiPageComponent,
      ),
    styling: () =>
      import('./polar-bar/sections/styling/polar-bar-styling-page.component').then(
        (module) => module.PolarBarStylingPageComponent,
      ),
    examples: () =>
      import('./polar-bar/sections/examples/polar-bar-examples-page.component').then(
        (module) => module.PolarBarExamplesPageComponent,
      ),
  },
  'radial-bar': {
    overview: () =>
      import('./radial-bar/sections/overview/radial-bar-overview-page.component').then(
        (module) => module.RadialBarOverviewPageComponent,
      ),
    api: () =>
      import('./radial-bar/sections/api/radial-bar-api-page.component').then(
        (module) => module.RadialBarApiPageComponent,
      ),
    styling: () =>
      import('./radial-bar/sections/styling/radial-bar-styling-page.component').then(
        (module) => module.RadialBarStylingPageComponent,
      ),
    examples: () =>
      import('./radial-bar/sections/examples/radial-bar-examples-page.component').then(
        (module) => module.RadialBarExamplesPageComponent,
      ),
  },
  'rounded-bar': {
    overview: () =>
      import('./rounded-bar/sections/overview/rounded-bar-overview-page.component').then(
        (module) => module.RoundedBarOverviewPageComponent,
      ),
    api: () =>
      import('./rounded-bar/sections/api/rounded-bar-api-page.component').then(
        (module) => module.RoundedBarApiPageComponent,
      ),
    styling: () =>
      import('./rounded-bar/sections/styling/rounded-bar-styling-page.component').then(
        (module) => module.RoundedBarStylingPageComponent,
      ),
    examples: () =>
      import('./rounded-bar/sections/examples/rounded-bar-examples-page.component').then(
        (module) => module.RoundedBarExamplesPageComponent,
      ),
  },
  'sorted-bar': {
    overview: () =>
      import('./sorted-bar/sections/overview/sorted-bar-overview-page.component').then(
        (module) => module.SortedBarOverviewPageComponent,
      ),
    api: () =>
      import('./sorted-bar/sections/api/sorted-bar-api-page.component').then(
        (module) => module.SortedBarApiPageComponent,
      ),
    styling: () =>
      import('./sorted-bar/sections/styling/sorted-bar-styling-page.component').then(
        (module) => module.SortedBarStylingPageComponent,
      ),
    examples: () =>
      import('./sorted-bar/sections/examples/sorted-bar-examples-page.component').then(
        (module) => module.SortedBarExamplesPageComponent,
      ),
  },
  'stacked-bar': {
    overview: () =>
      import('./stacked-bar/sections/overview/stacked-bar-overview-page.component').then(
        (module) => module.StackedBarOverviewPageComponent,
      ),
    api: () =>
      import('./stacked-bar/sections/api/stacked-bar-api-page.component').then(
        (module) => module.StackedBarApiPageComponent,
      ),
    styling: () =>
      import('./stacked-bar/sections/styling/stacked-bar-styling-page.component').then(
        (module) => module.StackedBarStylingPageComponent,
      ),
    examples: () =>
      import('./stacked-bar/sections/examples/stacked-bar-examples-page.component').then(
        (module) => module.StackedBarExamplesPageComponent,
      ),
  },
  'waterfall-bar': {
    overview: () =>
      import('./waterfall-bar/sections/overview/waterfall-bar-overview-page.component').then(
        (module) => module.WaterfallBarOverviewPageComponent,
      ),
    api: () =>
      import('./waterfall-bar/sections/api/waterfall-bar-api-page.component').then(
        (module) => module.WaterfallBarApiPageComponent,
      ),
    styling: () =>
      import('./waterfall-bar/sections/styling/waterfall-bar-styling-page.component').then(
        (module) => module.WaterfallBarStylingPageComponent,
      ),
    examples: () =>
      import('./waterfall-bar/sections/examples/waterfall-bar-examples-page.component').then(
        (module) => module.WaterfallBarExamplesPageComponent,
      ),
  },
};

export const CHARTS_BAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, BAR_CHART_SECTION_LOADERS[item.slug]),
  })),
];
