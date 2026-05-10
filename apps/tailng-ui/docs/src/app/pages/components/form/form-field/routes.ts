import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const formFieldItem = group.items.find((item) => item.slug === 'form-field');
if (formFieldItem === undefined) {
  throw new Error('Missing "form-field" in components form docs group.');
}

export const COMPONENTS_FORM_FORM_FIELD_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, formFieldItem),
    loadComponent: () =>
      import('./form-field-page.component').then((module) => module.FormFieldPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/form-field-overview-page.component').then(
            (module) => module.FormFieldOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/form-field-api-page.component').then(
            (module) => module.FormFieldApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/form-field-styling-page.component').then(
            (module) => module.FormFieldStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/form-field-examples-page.component').then(
            (module) => module.FormFieldExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];

