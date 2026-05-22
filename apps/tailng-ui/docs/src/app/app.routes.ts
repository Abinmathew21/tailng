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
    path: 'charts',
    loadChildren: () => import('./pages/charts/routes').then((m) => m.CHARTS_ROUTES),
  },
  {
    path: 'ownable',
    loadChildren: () => import('./pages/ownable/routes').then((m) => m.OWNABLE_ROUTES),
  },
  {
    path: 'headless',
    loadChildren: () => import('./pages/headless/routes').then((m) => m.HEADLESS_ROUTES),
  },
  {
    path: 'primitives/:group/:item',
    redirectTo: 'headless/:group/:item',
  },
  {
    path: 'primitives/:group',
    redirectTo: 'headless/:group',
  },
  {
    path: 'primitives',
    pathMatch: 'full',
    redirectTo: 'headless',
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
    path: 'plain-css-setup',
    pathMatch: 'full',
    redirectTo: 'components/getting-started/plain-css-setup',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
