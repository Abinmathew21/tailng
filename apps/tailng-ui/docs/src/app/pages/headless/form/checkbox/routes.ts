import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const checkboxItem = group.items.find((item) => item.slug === 'checkbox');
if (checkboxItem === undefined) {
  throw new Error('Missing "checkbox" in headless form docs group.');
}

export const HEADLESS_FORM_CHECKBOX_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, checkboxItem),
    loadComponent: () =>
      import('./checkbox-page.component').then((module) => module.HeadlessCheckboxPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-checkbox-overview-page.component').then(
            (module) => module.HeadlessCheckboxOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-checkbox-api-page.component').then(
            (module) => module.HeadlessCheckboxApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-checkbox-styling-page.component').then(
            (module) => module.HeadlessCheckboxStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-checkbox-examples-page.component').then(
            (module) => module.HeadlessCheckboxExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
