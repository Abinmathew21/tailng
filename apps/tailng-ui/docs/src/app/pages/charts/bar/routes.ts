import type { Routes } from '@angular/router';
import { CHARTS_SERIES_BAR_GROUP } from '../series/chart-series-docs.data';
import { buildChartSeriesItemRoutes } from '../series/shared/chart-series-item.routes';

const group = CHARTS_SERIES_BAR_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts bar series docs are empty.');
}

export const CHARTS_BAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesItemRoutes(group, item),
  })),
];
