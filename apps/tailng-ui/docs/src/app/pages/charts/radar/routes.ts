import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('radar');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts radar series docs are empty.');
}

const RADAR_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-radar': {
    overview: () =>
      import('./basic-radar/sections/overview/basic-radar-overview-page.component').then(
        (module) => module.BasicRadarOverviewPageComponent,
      ),
    api: () =>
      import('./basic-radar/sections/api/basic-radar-api-page.component').then(
        (module) => module.BasicRadarApiPageComponent,
      ),
    styling: () =>
      import('./basic-radar/sections/styling/basic-radar-styling-page.component').then(
        (module) => module.BasicRadarStylingPageComponent,
      ),
    examples: () =>
      import('./basic-radar/sections/examples/basic-radar-examples-page.component').then(
        (module) => module.BasicRadarExamplesPageComponent,
      ),
  },
  'customized-radar': {
    overview: () =>
      import('./customized-radar/sections/overview/customized-radar-overview-page.component').then(
        (module) => module.CustomizedRadarOverviewPageComponent,
      ),
    api: () =>
      import('./customized-radar/sections/api/customized-radar-api-page.component').then(
        (module) => module.CustomizedRadarApiPageComponent,
      ),
    styling: () =>
      import('./customized-radar/sections/styling/customized-radar-styling-page.component').then(
        (module) => module.CustomizedRadarStylingPageComponent,
      ),
    examples: () =>
      import('./customized-radar/sections/examples/customized-radar-examples-page.component').then(
        (module) => module.CustomizedRadarExamplesPageComponent,
      ),
  },
  'multiple-radar': {
    overview: () =>
      import('./multiple-radar/sections/overview/multiple-radar-overview-page.component').then(
        (module) => module.MultipleRadarOverviewPageComponent,
      ),
    api: () =>
      import('./multiple-radar/sections/api/multiple-radar-api-page.component').then(
        (module) => module.MultipleRadarApiPageComponent,
      ),
    styling: () =>
      import('./multiple-radar/sections/styling/multiple-radar-styling-page.component').then(
        (module) => module.MultipleRadarStylingPageComponent,
      ),
    examples: () =>
      import('./multiple-radar/sections/examples/multiple-radar-examples-page.component').then(
        (module) => module.MultipleRadarExamplesPageComponent,
      ),
  },
};

export const CHARTS_RADAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, RADAR_CHART_SECTION_LOADERS[item.slug]),
  })),
];
