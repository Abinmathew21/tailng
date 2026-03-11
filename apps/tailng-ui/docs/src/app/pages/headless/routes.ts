import type { Routes } from '@angular/router';
import { DEFAULT_HEADLESS_DOCS_SEGMENT } from './headless-docs.data';

export const HEADLESS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/headless-page.component').then((m) => m.HeadlessPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_HEADLESS_DOCS_SEGMENT,
      },
      {
        path: 'getting-started',
        loadChildren: () =>
          import('./getting-started/routes').then((m) => m.HEADLESS_GETTING_STARTED_ROUTES),
      },
      {
        path: 'form',
        loadChildren: () => import('./form/routes').then((m) => m.HEADLESS_FORM_ROUTES),
      },
      {
        path: 'utility',
        loadChildren: () => import('./utility/routes').then((m) => m.HEADLESS_UTILITY_ROUTES),
      },
      {
        path: 'navigation',
        loadChildren: () =>
          import('./navigation/routes').then((m) => m.HEADLESS_NAVIGATION_ROUTES),
      },
      {
        path: '**',
        redirectTo: DEFAULT_HEADLESS_DOCS_SEGMENT,
      },
    ],
  },
];
