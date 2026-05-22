import type { Routes } from '@angular/router';
import {
  CHARTS_COMPOSITION_GROUP,
  toChartsDocsRouteData,
} from '../chart-docs.data';

const group = CHARTS_COMPOSITION_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts composition docs are empty.');
}

const semiHeadlessItem = group.items.find((item) => item.slug === 'semi-headless');
if (semiHeadlessItem === undefined) {
  throw new Error('Missing "semi-headless" in charts composition docs group.');
}

export const CHARTS_COMPOSITION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: semiHeadlessItem.slug,
    data: toChartsDocsRouteData(group, semiHeadlessItem),
    loadComponent: () =>
      import('./semi-headless/charts-semi-headless-page.component').then(
        (module) => module.ChartsSemiHeadlessPageComponent,
      ),
  },
];
