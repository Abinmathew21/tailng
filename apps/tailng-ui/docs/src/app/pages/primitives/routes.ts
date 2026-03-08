import type { Routes } from '@angular/router';

export const PRIMITIVES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./landing/primitives-page.component').then((m) => m.PrimitivesPageComponent),
  },
];
