import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const heatmapchartItem = group.items.find((item) => item.slug === 'heatmap-chart');
if (heatmapchartItem === undefined) {
  throw new Error('Missing "heatmap-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_HEATMAP_CHART_ROUTES: Routes = [
  {
    path: '',
    data: toChartsDocsRouteData(group, heatmapchartItem),
    loadComponent: () =>
      import('./heatmap-chart-page.component').then((module) => module.HeatmapChartPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/heatmap-chart-overview-page.component').then(
            (module) => module.HeatmapChartOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/heatmap-chart-api-page.component').then(
            (module) => module.HeatmapChartApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/heatmap-chart-styling-page.component').then(
            (module) => module.HeatmapChartStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/heatmap-chart-examples-page.component').then(
            (module) => module.HeatmapChartExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
