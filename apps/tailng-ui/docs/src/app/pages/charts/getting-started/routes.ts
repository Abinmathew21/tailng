import type { Routes } from '@angular/router';
import {
  CHARTS_GETTING_STARTED_GROUP,
  toChartsDocsRouteData,
} from '../chart-docs.data';

const group = CHARTS_GETTING_STARTED_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts getting-started docs are empty.');
}

const overviewItem = group.items.find((item) => item.slug === 'overview');
if (overviewItem === undefined) {
  throw new Error('Missing "overview" in charts getting-started docs group.');
}

const installationItem = group.items.find((item) => item.slug === 'installation');
if (installationItem === undefined) {
  throw new Error('Missing "installation" in charts getting-started docs group.');
}

export const CHARTS_GETTING_STARTED_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: overviewItem.slug,
    data: toChartsDocsRouteData(group, overviewItem),
    loadComponent: () =>
      import('./overview/charts-overview-page.component').then(
        (module) => module.ChartsOverviewPageComponent,
      ),
  },
  {
    path: installationItem.slug,
    data: toChartsDocsRouteData(group, installationItem),
    loadComponent: () =>
      import('./installation/charts-installation-page.component').then(
        (module) => module.ChartsInstallationPageComponent,
      ),
  },
];
