import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const inputItem = group.items.find((item) => item.slug === 'input');
if (inputItem === undefined) {
  throw new Error('Missing "input" in headless form docs group.');
}

export const HEADLESS_FORM_INPUT_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, inputItem),
    loadComponent: () =>
      import('./input-page.component').then((module) => module.HeadlessInputPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-input-overview-page.component').then(
            (module) => module.HeadlessInputOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-input-api-page.component').then(
            (module) => module.HeadlessInputApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-input-styling-page.component').then(
            (module) => module.HeadlessInputStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-input-examples-page.component').then(
            (module) => module.HeadlessInputExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
