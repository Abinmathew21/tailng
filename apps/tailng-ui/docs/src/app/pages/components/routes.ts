import type { Routes } from '@angular/router';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./landing/components-page.component').then((m) => m.ComponentsPageComponent),
  },
];
