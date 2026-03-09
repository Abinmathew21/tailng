import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_FORM_GROUP;

export const COMPONENTS_FORM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/form-landing-page.component').then(
        (module) => module.FormLandingPageComponent,
      ),
  })),
];
