import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const linechartItem = group.items.find((item) => item.slug === 'line-chart');
if (linechartItem === undefined) {
  throw new Error('Missing "line-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_LINE_CHART_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, linechartItem),
    loadComponent: () =>
      import('./line-chart-page.component').then((module) => module.LineChartPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/line-chart-overview-page.component').then(
            (module) => module.LineChartOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/line-chart-api-page.component').then(
            (module) => module.LineChartApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/line-chart-styling-page.component').then(
            (module) => module.LineChartStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/line-chart-examples-page.component').then(
            (module) => module.LineChartExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
