import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const scatterchartItem = group.items.find((item) => item.slug === 'scatter-chart');
if (scatterchartItem === undefined) {
  throw new Error('Missing "scatter-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_SCATTER_CHART_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, scatterchartItem),
    loadComponent: () =>
      import('./scatter-chart-page.component').then((module) => module.ScatterChartPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/scatter-chart-overview-page.component').then(
            (module) => module.ScatterChartOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/scatter-chart-api-page.component').then(
            (module) => module.ScatterChartApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/scatter-chart-styling-page.component').then(
            (module) => module.ScatterChartStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/scatter-chart-examples-page.component').then(
            (module) => module.ScatterChartExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
