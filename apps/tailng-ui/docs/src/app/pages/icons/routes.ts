import type { Routes } from '@angular/router';

export const ICONS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/icons-page.component').then((m) => m.IconsPageComponent),
  },
];
