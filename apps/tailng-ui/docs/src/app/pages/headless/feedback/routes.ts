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
];
