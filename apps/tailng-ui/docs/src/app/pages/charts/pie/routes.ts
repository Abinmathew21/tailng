import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('pie');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts pie series docs are empty.');
}

const PIE_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'pie-chart': {
    overview: () =>
      import('./pie-chart/sections/overview/pie-chart-overview-page.component').then(
        (module) => module.PieChartOverviewPageComponent,
      ),
    api: () =>
      import('./pie-chart/sections/api/pie-chart-api-page.component').then(
        (module) => module.PieChartApiPageComponent,
      ),
    styling: () =>
      import('./pie-chart/sections/styling/pie-chart-styling-page.component').then(
        (module) => module.PieChartStylingPageComponent,
      ),
    examples: () =>
      import('./pie-chart/sections/examples/pie-chart-examples-page.component').then(
        (module) => module.PieChartExamplesPageComponent,
      ),
  },
  'basic-pie': {
    overview: () =>
      import('./basic-pie/sections/overview/basic-pie-overview-page.component').then(
        (module) => module.BasicPieOverviewPageComponent,
      ),
    api: () =>
      import('./basic-pie/sections/api/basic-pie-api-page.component').then(
        (module) => module.BasicPieApiPageComponent,
      ),
    styling: () =>
      import('./basic-pie/sections/styling/basic-pie-styling-page.component').then(
        (module) => module.BasicPieStylingPageComponent,
      ),
    examples: () =>
      import('./basic-pie/sections/examples/basic-pie-examples-page.component').then(
        (module) => module.BasicPieExamplesPageComponent,
      ),
  },
  'donut': {
    overview: () =>
      import('./donut/sections/overview/donut-overview-page.component').then(
        (module) => module.DonutOverviewPageComponent,
      ),
    api: () =>
      import('./donut/sections/api/donut-api-page.component').then(
        (module) => module.DonutApiPageComponent,
      ),
    styling: () =>
      import('./donut/sections/styling/donut-styling-page.component').then(
        (module) => module.DonutStylingPageComponent,
      ),
    examples: () =>
      import('./donut/sections/examples/donut-examples-page.component').then(
        (module) => module.DonutExamplesPageComponent,
      ),
  },
  'half-donut': {
    overview: () =>
      import('./half-donut/sections/overview/half-donut-overview-page.component').then(
        (module) => module.HalfDonutOverviewPageComponent,
      ),
    api: () =>
      import('./half-donut/sections/api/half-donut-api-page.component').then(
        (module) => module.HalfDonutApiPageComponent,
      ),
    styling: () =>
      import('./half-donut/sections/styling/half-donut-styling-page.component').then(
        (module) => module.HalfDonutStylingPageComponent,
      ),
    examples: () =>
      import('./half-donut/sections/examples/half-donut-examples-page.component').then(
        (module) => module.HalfDonutExamplesPageComponent,
      ),
  },
  'nested-pie': {
    overview: () =>
      import('./nested-pie/sections/overview/nested-pie-overview-page.component').then(
        (module) => module.NestedPieOverviewPageComponent,
      ),
    api: () =>
      import('./nested-pie/sections/api/nested-pie-api-page.component').then(
        (module) => module.NestedPieApiPageComponent,
      ),
    styling: () =>
      import('./nested-pie/sections/styling/nested-pie-styling-page.component').then(
        (module) => module.NestedPieStylingPageComponent,
      ),
    examples: () =>
      import('./nested-pie/sections/examples/nested-pie-examples-page.component').then(
        (module) => module.NestedPieExamplesPageComponent,
      ),
  },
  'nightingale': {
    overview: () =>
      import('./nightingale/sections/overview/nightingale-overview-page.component').then(
        (module) => module.NightingaleOverviewPageComponent,
      ),
    api: () =>
      import('./nightingale/sections/api/nightingale-api-page.component').then(
        (module) => module.NightingaleApiPageComponent,
      ),
    styling: () =>
      import('./nightingale/sections/styling/nightingale-styling-page.component').then(
        (module) => module.NightingaleStylingPageComponent,
      ),
    examples: () =>
      import('./nightingale/sections/examples/nightingale-examples-page.component').then(
        (module) => module.NightingaleExamplesPageComponent,
      ),
  },
  'pie-on-calendar': {
    overview: () =>
      import('./pie-on-calendar/sections/overview/pie-on-calendar-overview-page.component').then(
        (module) => module.PieOnCalendarOverviewPageComponent,
      ),
    api: () =>
      import('./pie-on-calendar/sections/api/pie-on-calendar-api-page.component').then(
        (module) => module.PieOnCalendarApiPageComponent,
      ),
    styling: () =>
      import('./pie-on-calendar/sections/styling/pie-on-calendar-styling-page.component').then(
        (module) => module.PieOnCalendarStylingPageComponent,
      ),
    examples: () =>
      import('./pie-on-calendar/sections/examples/pie-on-calendar-examples-page.component').then(
        (module) => module.PieOnCalendarExamplesPageComponent,
      ),
  },
  'pie-on-geo-map': {
    overview: () =>
      import('./pie-on-geo-map/sections/overview/pie-on-geo-map-overview-page.component').then(
        (module) => module.PieOnGeoMapOverviewPageComponent,
      ),
    api: () =>
      import('./pie-on-geo-map/sections/api/pie-on-geo-map-api-page.component').then(
        (module) => module.PieOnGeoMapApiPageComponent,
      ),
    styling: () =>
      import('./pie-on-geo-map/sections/styling/pie-on-geo-map-styling-page.component').then(
        (module) => module.PieOnGeoMapStylingPageComponent,
      ),
    examples: () =>
      import('./pie-on-geo-map/sections/examples/pie-on-geo-map-examples-page.component').then(
        (module) => module.PieOnGeoMapExamplesPageComponent,
      ),
  },
  'rounded-donut': {
    overview: () =>
      import('./rounded-donut/sections/overview/rounded-donut-overview-page.component').then(
        (module) => module.RoundedDonutOverviewPageComponent,
      ),
    api: () =>
      import('./rounded-donut/sections/api/rounded-donut-api-page.component').then(
        (module) => module.RoundedDonutApiPageComponent,
      ),
    styling: () =>
      import('./rounded-donut/sections/styling/rounded-donut-styling-page.component').then(
        (module) => module.RoundedDonutStylingPageComponent,
      ),
    examples: () =>
      import('./rounded-donut/sections/examples/rounded-donut-examples-page.component').then(
        (module) => module.RoundedDonutExamplesPageComponent,
      ),
  },
  'scrollable-legend-pie': {
    overview: () =>
      import('./scrollable-legend-pie/sections/overview/scrollable-legend-pie-overview-page.component').then(
        (module) => module.ScrollableLegendPieOverviewPageComponent,
      ),
    api: () =>
      import('./scrollable-legend-pie/sections/api/scrollable-legend-pie-api-page.component').then(
        (module) => module.ScrollableLegendPieApiPageComponent,
      ),
    styling: () =>
      import('./scrollable-legend-pie/sections/styling/scrollable-legend-pie-styling-page.component').then(
        (module) => module.ScrollableLegendPieStylingPageComponent,
      ),
    examples: () =>
      import('./scrollable-legend-pie/sections/examples/scrollable-legend-pie-examples-page.component').then(
        (module) => module.ScrollableLegendPieExamplesPageComponent,
      ),
  },
};

export const CHARTS_PIE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, PIE_CHART_SECTION_LOADERS[item.slug]),
  })),
];
