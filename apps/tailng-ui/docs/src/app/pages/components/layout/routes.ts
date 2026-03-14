import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const defaultLayoutItem = group.items[0];
if (defaultLayoutItem === undefined) {
  throw new Error('Components layout docs group must include at least one item.');
}

const collapsibleItem = group.items.find((item) => item.slug === 'collapsible');
if (collapsibleItem === undefined) {
  throw new Error('Missing "collapsible" in components layout docs group.');
}

const accordionItem = group.items.find((item) => item.slug === 'accordion');
if (accordionItem === undefined) {
  throw new Error('Missing "accordion" in components layout docs group.');
}

const stepperItem = group.items.find((item) => item.slug === 'stepper');
if (stepperItem === undefined) {
  throw new Error('Missing "stepper" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultLayoutItem.slug,
  },
  {
    path: collapsibleItem.slug,
    data: toComponentsDocsRouteData(group, collapsibleItem),
    loadChildren: () =>
      import('./collapsible/routes').then(
        (module) => module.COMPONENTS_LAYOUT_COLLAPSIBLE_ROUTES,
      ),
  },
  {
    path: accordionItem.slug,
    data: toComponentsDocsRouteData(group, accordionItem),
    loadChildren: () =>
      import('./accordion/routes').then(
        (module) => module.COMPONENTS_LAYOUT_ACCORDION_ROUTES,
      ),
  },
  {
    path: stepperItem.slug,
    data: toComponentsDocsRouteData(group, stepperItem),
    loadChildren: () =>
      import('./stepper/routes').then((module) => module.COMPONENTS_LAYOUT_STEPPER_ROUTES),
  },
];
