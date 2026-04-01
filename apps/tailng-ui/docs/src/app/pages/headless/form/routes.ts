import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../headless-docs.data';

const group = HEADLESS_FORM_GROUP;

export const HEADLESS_FORM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'input',
    loadChildren: () => import('./input/routes').then((m) => m.HEADLESS_FORM_INPUT_ROUTES),
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
    path: 'radio',
    loadChildren: () => import('./radio/routes').then((m) => m.HEADLESS_FORM_RADIO_ROUTES),
  },
  ...group.items
    .filter(
      (item) =>
        item.slug !== 'input' &&
        item.slug !== 'textarea' &&
        item.slug !== 'label' &&
        item.slug !== 'checkbox' &&
        item.slug !== 'radio',
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
