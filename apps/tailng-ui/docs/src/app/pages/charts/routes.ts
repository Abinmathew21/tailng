import type { Routes } from '@angular/router';

export const CHARTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./landing/charts-page.component').then((module) => module.ChartsPageComponent),
  },
];
