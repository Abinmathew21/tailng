import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const piechartItem = group.items.find((item) => item.slug === 'pie-chart');
if (piechartItem === undefined) {
  throw new Error('Missing "pie-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_PIE_CHART_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, piechartItem),
    loadComponent: () =>
      import('./pie-chart-page.component').then((module) => module.PieChartPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/pie-chart-overview-page.component').then(
            (module) => module.PieChartOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/pie-chart-api-page.component').then(
            (module) => module.PieChartApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/pie-chart-styling-page.component').then(
            (module) => module.PieChartStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/pie-chart-examples-page.component').then(
            (module) => module.PieChartExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
