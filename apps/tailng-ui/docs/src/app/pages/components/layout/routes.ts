import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const stepperItem = group.items.find((item) => item.slug === 'stepper');
if (stepperItem === undefined) {
  throw new Error('Missing "stepper" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: stepperItem.slug,
  },
  {
    path: stepperItem.slug,
    data: toComponentsDocsRouteData(group, stepperItem),
    loadChildren: () =>
      import('./stepper/routes').then((module) => module.COMPONENTS_LAYOUT_STEPPER_ROUTES),
  },
];

