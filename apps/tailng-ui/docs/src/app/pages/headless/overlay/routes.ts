import type { Routes } from '@angular/router';
import { HEADLESS_OVERLAY_GROUP } from '../headless-docs.data';

const group = HEADLESS_OVERLAY_GROUP;

export const HEADLESS_OVERLAY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'dialog',
    loadChildren: () =>
      import('./dialog/routes').then((module) => module.HEADLESS_OVERLAY_DIALOG_ROUTES),
  },
  {
    path: 'popover',
    loadChildren: () =>
      import('./popover/routes').then((module) => module.HEADLESS_OVERLAY_POPOVER_ROUTES),
  },
];
