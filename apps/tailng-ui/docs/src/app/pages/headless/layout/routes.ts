import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP } from '../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;

export const HEADLESS_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'collapsible',
    loadChildren: () =>
      import('./collapsible/routes').then((module) => module.HEADLESS_LAYOUT_COLLAPSIBLE_ROUTES),
  },
];
