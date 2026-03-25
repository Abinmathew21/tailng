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
  ...group.items
    .filter((item) => item.slug !== 'input')
    .map((item) => ({
    path: item.slug,
    data: toHeadlessDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/form-landing-page.component').then(
        (module) => module.FormLandingPageComponent,
      ),
    })),
];
