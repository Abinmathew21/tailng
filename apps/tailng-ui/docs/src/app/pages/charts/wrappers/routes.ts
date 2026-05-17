import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts wrappers docs are empty.');
}

const lineChartItem = group.items.find((item) => item.slug === 'line-chart');
if (lineChartItem === undefined) {
  throw new Error('Missing "line-chart" in charts wrappers docs group.');
}

const barChartItem = group.items.find((item) => item.slug === 'bar-chart');
if (barChartItem === undefined) {
  throw new Error('Missing "bar-chart" in charts wrappers docs group.');
}

const areaChartItem = group.items.find((item) => item.slug === 'area-chart');
if (areaChartItem === undefined) {
  throw new Error('Missing "area-chart" in charts wrappers docs group.');
}

const pieChartItem = group.items.find((item) => item.slug === 'pie-chart');
if (pieChartItem === undefined) {
  throw new Error('Missing "pie-chart" in charts wrappers docs group.');
}

const scatterChartItem = group.items.find((item) => item.slug === 'scatter-chart');
if (scatterChartItem === undefined) {
  throw new Error('Missing "scatter-chart" in charts wrappers docs group.');
}

const heatmapChartItem = group.items.find((item) => item.slug === 'heatmap-chart');
if (heatmapChartItem === undefined) {
  throw new Error('Missing "heatmap-chart" in charts wrappers docs group.');
}

export const CHARTS_WRAPPERS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: lineChartItem.slug,
    data: toChartsDocsRouteData(group, lineChartItem),
    loadChildren: () =>
      import('./line-chart/routes').then((module) => module.CHARTS_WRAPPERS_LINE_CHART_ROUTES),
  },
  {
    path: barChartItem.slug,
    data: toChartsDocsRouteData(group, barChartItem),
    loadChildren: () =>
      import('./bar-chart/routes').then((module) => module.CHARTS_WRAPPERS_BAR_CHART_ROUTES),
  },
  {
    path: areaChartItem.slug,
    data: toChartsDocsRouteData(group, areaChartItem),
    loadChildren: () =>
      import('./area-chart/routes').then((module) => module.CHARTS_WRAPPERS_AREA_CHART_ROUTES),
  },
  {
    path: pieChartItem.slug,
    data: toChartsDocsRouteData(group, pieChartItem),
    loadChildren: () =>
      import('./pie-chart/routes').then((module) => module.CHARTS_WRAPPERS_PIE_CHART_ROUTES),
  },
  {
    path: scatterChartItem.slug,
    data: toChartsDocsRouteData(group, scatterChartItem),
    loadChildren: () =>
      import('./scatter-chart/routes').then(
        (module) => module.CHARTS_WRAPPERS_SCATTER_CHART_ROUTES,
      ),
  },
  {
    path: heatmapChartItem.slug,
    data: toChartsDocsRouteData(group, heatmapChartItem),
    loadChildren: () =>
      import('./heatmap-chart/routes').then(
        (module) => module.CHARTS_WRAPPERS_HEATMAP_CHART_ROUTES,
      ),
  },
];
