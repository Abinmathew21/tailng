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
const buttonToggleItem = group.items.find((item) => item.slug === 'button-toggle');
if (buttonToggleItem === undefined) {
  throw new Error('Missing "button-toggle" in components form docs group.');
}
const listboxItem = group.items.find((item) => item.slug === 'listbox');
if (listboxItem === undefined) {
  throw new Error('Missing "listbox" in components form docs group.');
}
const autocompleteItem = group.items.find((item) => item.slug === 'autocomplete');
if (autocompleteItem === undefined) {
  throw new Error('Missing "autocomplete" in components form docs group.');
}
const multiAutocompleteItem = group.items.find((item) => item.slug === 'multi-autocomplete');
if (multiAutocompleteItem === undefined) {
  throw new Error('Missing "multi-autocomplete" in components form docs group.');
}
const selectboxItem = group.items.find((item) => item.slug === 'selectbox');
if (selectboxItem === undefined) {
  throw new Error('Missing "selectbox" in components form docs group.');
}
const multiselectItem = group.items.find((item) => item.slug === 'multiselect');
if (multiselectItem === undefined) {
  throw new Error('Missing "multiselect" in components form docs group.');
}
const chipsItem = group.items.find((item) => item.slug === 'chips');
if (chipsItem === undefined) {
  throw new Error('Missing "chips" in components form docs group.');
}

const landingSlugs = new Set([
  inputItem.slug,
  checkboxItem.slug,
  toggleItem.slug,
  buttonToggleItem.slug,
  listboxItem.slug,
  autocompleteItem.slug,
  multiAutocompleteItem.slug,
  selectboxItem.slug,
  multiselectItem.slug,
  chipsItem.slug,
]);

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
  {
    path: buttonToggleItem.slug,
    loadChildren: () =>
      import('./button-toggle/routes').then(
        (module) => module.COMPONENTS_FORM_BUTTON_TOGGLE_ROUTES,
      ),
  },
  {
    path: listboxItem.slug,
    loadChildren: () =>
      import('./listbox/routes').then((module) => module.COMPONENTS_FORM_LISTBOX_ROUTES),
  },
  {
    path: autocompleteItem.slug,
    loadChildren: () =>
      import('./autocomplete/routes').then((module) => module.COMPONENTS_FORM_AUTOCOMPLETE_ROUTES),
  },
  {
    path: multiAutocompleteItem.slug,
    loadChildren: () =>
      import('./multi-autocomplete/routes').then(
        (module) => module.COMPONENTS_FORM_MULTI_AUTOCOMPLETE_ROUTES,
      ),
  },
  {
    path: selectboxItem.slug,
    loadChildren: () =>
      import('./selectbox/routes').then((module) => module.COMPONENTS_FORM_SELECTBOX_ROUTES),
  },
  {
    path: multiselectItem.slug,
    loadChildren: () =>
      import('./multiselect/routes').then((module) => module.COMPONENTS_FORM_MULTISELECT_ROUTES),
  },
  {
    path: chipsItem.slug,
    loadChildren: () =>
      import('./chips/routes').then((module) => module.COMPONENTS_FORM_CHIPS_ROUTES),
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
