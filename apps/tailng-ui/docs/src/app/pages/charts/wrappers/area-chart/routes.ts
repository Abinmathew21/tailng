import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const areachartItem = group.items.find((item) => item.slug === 'area-chart');
if (areachartItem === undefined) {
  throw new Error('Missing "area-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_AREA_CHART_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, areachartItem),
    loadComponent: () =>
      import('./area-chart-page.component').then((module) => module.AreaChartPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/area-chart-overview-page.component').then(
            (module) => module.AreaChartOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/area-chart-api-page.component').then(
            (module) => module.AreaChartApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/area-chart-styling-page.component').then(
            (module) => module.AreaChartStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/area-chart-examples-page.component').then(
            (module) => module.AreaChartExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
