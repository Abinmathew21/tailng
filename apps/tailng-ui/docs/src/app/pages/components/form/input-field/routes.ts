import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const inputFieldItem = group.items.find((item) => item.slug === 'input-field');
if (inputFieldItem === undefined) {
  throw new Error('Missing "input-field" in components form docs group.');
}

export const COMPONENTS_FORM_INPUT_FIELD_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, inputFieldItem),
    loadComponent: () =>
      import('./input-field-page.component').then((module) => module.InputFieldPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/input-field-overview-page.component').then(
            (module) => module.InputFieldOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/input-field-api-page.component').then(
            (module) => module.InputFieldApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/input-field-styling-page.component').then(
            (module) => module.InputFieldStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/input-field-examples-page.component').then(
            (module) => module.InputFieldExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
