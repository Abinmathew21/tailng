import type { Routes } from '@angular/router';
import type { ChartsDocsItem } from '../chart-docs.data';
import { CHARTS_SERIES_BAR_GROUP } from '../series/chart-series-docs.data';
import { buildChartSeriesItemRoutes } from '../series/shared/chart-series-item.routes';

const group = CHARTS_SERIES_BAR_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts bar series docs are empty.');
}

const genericBarSlugs = [
  'bar-chart',
  'bar-race',
  'basic-bar',
  'drilldown-bar',
  'dynamic-bar',
  'grouped-bar',
  'horizontal-bar',
  'large-scale-bar',
  'negative-bar',
  'normalized-stacked-bar',
  'polar-bar',
  'radial-bar',
  'rounded-bar',
  'sorted-bar',
  'waterfall-bar',
] as const;

function requireBarItem(slug: string): ChartsDocsItem {
  const item = group.items.find((entry) => entry.slug === slug);
  if (item === undefined) {
    throw new Error(`Missing "${slug}" in charts bar series docs group.`);
  }

  return item;
}

export const CHARTS_BAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...genericBarSlugs.map((slug) => ({
    path: slug,
    children: buildChartSeriesItemRoutes(group, requireBarItem(slug)),
  })),
  {
    path: 'stacked-bar',
    loadChildren: () =>
      import('./stacked-bar/routes').then((module) => module.CHARTS_BAR_STACKED_BAR_ROUTES),
  },
];
