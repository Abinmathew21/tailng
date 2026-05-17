import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const barchartItem = group.items.find((item) => item.slug === 'bar-chart');
if (barchartItem === undefined) {
  throw new Error('Missing "bar-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_BAR_CHART_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, barchartItem),
    loadComponent: () =>
      import('./bar-chart-page.component').then((module) => module.BarChartPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/bar-chart-overview-page.component').then(
            (module) => module.BarChartOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/bar-chart-api-page.component').then(
            (module) => module.BarChartApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/bar-chart-styling-page.component').then(
            (module) => module.BarChartStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/bar-chart-examples-page.component').then(
            (module) => module.BarChartExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
