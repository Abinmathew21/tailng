import type { Routes } from '@angular/router';

export const CDK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/cdk-page.component').then((m) => m.CdkPageComponent),
  },
];
