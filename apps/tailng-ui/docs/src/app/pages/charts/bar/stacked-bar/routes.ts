import type { Routes } from '@angular/router';
import { toChartsDocsRouteData } from '../../chart-docs.data';
import { CHARTS_SERIES_BAR_GROUP } from '../../series/chart-series-docs.data';

const group = CHARTS_SERIES_BAR_GROUP;
const stackedBarItem = group.items.find((item) => item.slug === 'stacked-bar');
if (stackedBarItem === undefined) {
  throw new Error('Missing "stacked-bar" in charts bar series docs group.');
}

export const CHARTS_BAR_STACKED_BAR_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, stackedBarItem),
    loadComponent: () =>
      import('../../series/shared/chart-series-page.component').then(
        (module) => module.ChartSeriesPageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/stacked-bar-overview-page.component').then(
            (module) => module.StackedBarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/stacked-bar-api-page.component').then(
            (module) => module.StackedBarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/stacked-bar-styling-page.component').then(
            (module) => module.StackedBarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/stacked-bar-examples-page.component').then(
            (module) => module.StackedBarExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
