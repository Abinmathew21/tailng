import type { Routes } from '@angular/router';

export const THEME_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/theme-page.component').then((m) => m.ThemePageComponent),
  },
];
