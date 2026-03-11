import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Components form docs are empty.');
}

const inputItem = group.items.find((item) => item.slug === 'input');
if (inputItem === undefined) {
  throw new Error('Missing "input" in components form docs group.');
}
const checkboxItem = group.items.find((item) => item.slug === 'checkbox');
if (checkboxItem === undefined) {
  throw new Error('Missing "checkbox" in components form docs group.');
}
const toggleItem = group.items.find((item) => item.slug === 'toggle');
if (toggleItem === undefined) {
  throw new Error('Missing "toggle" in components form docs group.');
}

const landingSlugs = new Set([inputItem.slug, checkboxItem.slug, toggleItem.slug]);

export const COMPONENTS_FORM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: inputItem.slug,
    loadChildren: () =>
      import('./input/routes').then((module) => module.COMPONENTS_FORM_INPUT_ROUTES),
  },
  {
    path: checkboxItem.slug,
    loadChildren: () =>
      import('./checkbox/routes').then((module) => module.COMPONENTS_FORM_CHECKBOX_ROUTES),
  },
  {
    path: toggleItem.slug,
    loadChildren: () =>
      import('./toggle/routes').then((module) => module.COMPONENTS_FORM_TOGGLE_ROUTES),
  },
  ...group.items
    .filter((item) => !landingSlugs.has(item.slug))
    .map((item) => ({
      path: item.slug,
      data: toComponentsDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/form-landing-page.component').then(
          (module) => module.FormLandingPageComponent,
        ),
    })),
];
