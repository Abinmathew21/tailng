import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./pages/landing/routes').then((m) => m.LANDING_ROUTES),
  },
  {
    path: 'components',
    loadChildren: () => import('./pages/components/routes').then((m) => m.COMPONENTS_ROUTES),
  },
  {
    path: 'primitives',
    loadChildren: () => import('./pages/primitives/routes').then((m) => m.PRIMITIVES_ROUTES),
  },
  {
    path: 'cdk',
    loadChildren: () => import('./pages/cdk/routes').then((m) => m.CDK_ROUTES),
  },
  {
    path: 'theme',
    loadChildren: () => import('./pages/theme/routes').then((m) => m.THEME_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () => import('./pages/icons/routes').then((m) => m.ICONS_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
