import type { Routes } from '@angular/router';
import { DEFAULT_CHARTS_DOCS_SEGMENT } from './chart-docs.data';

export const CHARTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/charts-page.component').then((module) => module.ChartsPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_CHARTS_DOCS_SEGMENT,
      },
      {
        path: 'getting-started',
        loadChildren: () =>
          import('./getting-started/routes').then((module) => module.CHARTS_GETTING_STARTED_ROUTES),
      },
      {
        path: 'wrappers',
        loadChildren: () =>
          import('./wrappers/routes').then((module) => module.CHARTS_WRAPPERS_ROUTES),
      },
      {
        path: 'composition',
        loadChildren: () =>
          import('./composition/routes').then((module) => module.CHARTS_COMPOSITION_ROUTES),
      },
      {
        path: '**',
        redirectTo: DEFAULT_CHARTS_DOCS_SEGMENT,
      },
    ],
  },
];
