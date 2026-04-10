import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../headless-docs.data';

const group = HEADLESS_FORM_GROUP;

export const HEADLESS_FORM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0].slug,
  },
  {
    path: 'input',
    loadChildren: () => import('./input/routes').then((m) => m.HEADLESS_FORM_INPUT_ROUTES),
  },
  {
    path: 'input-group',
    loadChildren: () =>
      import('./input-group/routes').then((m) => m.HEADLESS_FORM_INPUT_GROUP_ROUTES),
  },
  {
    path: 'textarea',
    loadChildren: () =>
      import('./textarea/routes').then((m) => m.HEADLESS_FORM_TEXTAREA_ROUTES),
  },
  {
    path: 'label',
    loadChildren: () => import('./label/routes').then((m) => m.HEADLESS_FORM_LABEL_ROUTES),
  },
  {
    path: 'checkbox',
    loadChildren: () =>
      import('./checkbox/routes').then((m) => m.HEADLESS_FORM_CHECKBOX_ROUTES),
  },
  {
    path: 'switch',
    loadChildren: () => import('./switch/routes').then((m) => m.HEADLESS_FORM_SWITCH_ROUTES),
  },
  {
    path: 'toggle',
    loadChildren: () => import('./toggle/routes').then((m) => m.HEADLESS_FORM_TOGGLE_ROUTES),
  },
  {
    path: 'radio',
    loadChildren: () => import('./radio/routes').then((m) => m.HEADLESS_FORM_RADIO_ROUTES),
  },
  {
    path: 'button-toggle',
    loadChildren: () =>
      import('./button-toggle/routes').then((m) => m.HEADLESS_FORM_BUTTON_TOGGLE_ROUTES),
  },
  {
    path: 'chips',
    loadChildren: () => import('./chips/routes').then((m) => m.HEADLESS_FORM_CHIPS_ROUTES),
  },
  {
    path: 'input-otp',
    loadChildren: () =>
      import('./input-otp/routes').then((m) => m.HEADLESS_FORM_INPUT_OTP_ROUTES),
  },
  {
    path: 'listbox',
    loadChildren: () => import('./listbox/routes').then((m) => m.HEADLESS_FORM_LISTBOX_ROUTES),
  },
  {
    path: 'autocomplete',
    loadChildren: () =>
      import('./autocomplete/routes').then((m) => m.HEADLESS_FORM_AUTOCOMPLETE_ROUTES),
  },
  {
    path: 'multi-autocomplete',
    loadChildren: () =>
      import('./multi-autocomplete/routes').then(
        (m) => m.HEADLESS_FORM_MULTI_AUTOCOMPLETE_ROUTES,
      ),
  },
  {
    path: 'selectbox',
    loadChildren: () => import('./selectbox/routes').then((m) => m.HEADLESS_FORM_SELECTBOX_ROUTES),
  },
  {
    path: 'multiselect',
    loadChildren: () => import('./multiselect/routes').then((m) => m.HEADLESS_FORM_MULTISELECT_ROUTES),
  },
  ...group.items
    .filter(
      (item) =>
        item.slug !== 'input' &&
        item.slug !== 'input-group' &&
        item.slug !== 'textarea' &&
        item.slug !== 'label' &&
        item.slug !== 'checkbox' &&
        item.slug !== 'switch' &&
        item.slug !== 'toggle' &&
        item.slug !== 'radio' &&
        item.slug !== 'button-toggle' &&
        item.slug !== 'chips' &&
        item.slug !== 'input-otp' &&
        item.slug !== 'listbox' &&
        item.slug !== 'autocomplete' &&
        item.slug !== 'multi-autocomplete' &&
        item.slug !== 'selectbox' &&
        item.slug !== 'multiselect',
    )
    .map((item) => ({
      path: item.slug,
      data: toHeadlessDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/form-landing-page.component').then(
          (module) => module.FormLandingPageComponent,
        ),
    })),
];
