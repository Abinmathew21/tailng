import type { Routes } from '@angular/router';
import { HEADLESS_FEEDBACK_GROUP } from '../headless-docs.data';

const group = HEADLESS_FEEDBACK_GROUP;

export const HEADLESS_FEEDBACK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'toast',
    loadChildren: () =>
      import('./toast/routes').then((module) => module.HEADLESS_FEEDBACK_TOAST_ROUTES),
  },
  {
    path: 'empty',
    loadChildren: () =>
      import('./empty/routes').then((module) => module.HEADLESS_FEEDBACK_EMPTY_ROUTES),
  },
  {
    path: 'progress-bar',
    loadChildren: () =>
      import('./progress-bar/routes').then((module) => module.HEADLESS_FEEDBACK_PROGRESS_BAR_ROUTES),
  },
  {
    path: 'progress-spinner',
    loadChildren: () =>
      import('./progress-spinner/routes').then(
        (module) => module.HEADLESS_FEEDBACK_PROGRESS_SPINNER_ROUTES,
      ),
  },
  {
    path: 'skeleton',
    loadChildren: () =>
      import('./skeleton/routes').then((module) => module.HEADLESS_FEEDBACK_SKELETON_ROUTES),
  },
];
