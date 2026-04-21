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
    path: 'card',
    loadChildren: () =>
      import('./card/routes').then((module) => module.HEADLESS_LAYOUT_CARD_ROUTES),
  },
  {
    path: 'separator',
    loadChildren: () =>
      import('./separator/routes').then((module) => module.HEADLESS_LAYOUT_SEPARATOR_ROUTES),
  },
  {
    path: 'collapsible',
    loadChildren: () =>
      import('./collapsible/routes').then((module) => module.HEADLESS_LAYOUT_COLLAPSIBLE_ROUTES),
  },
  {
    path: 'accordion',
    loadChildren: () =>
      import('./accordion/routes').then((module) => module.HEADLESS_LAYOUT_ACCORDION_ROUTES),
  },
  {
    path: 'stepper',
    loadChildren: () =>
      import('./stepper/routes').then((module) => module.HEADLESS_LAYOUT_STEPPER_ROUTES),
  },
];
