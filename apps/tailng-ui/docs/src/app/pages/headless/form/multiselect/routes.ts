import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const multiselectItem = group.items.find((item) => item.slug === 'multiselect');
if (multiselectItem === undefined) {
  throw new Error('Missing "multiselect" in headless form docs group.');
}

export const HEADLESS_FORM_MULTISELECT_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, multiselectItem),
    loadComponent: () =>
      import('./multiselect-page.component').then((module) => module.HeadlessMultiselectPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/multiselect-overview-page.component').then(
            (module) => module.HeadlessMultiselectOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/multiselect-api-page.component').then(
            (module) => module.HeadlessMultiselectApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/multiselect-styling-page.component').then(
            (module) => module.HeadlessMultiselectStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/multiselect-examples-page.component').then(
            (module) => module.HeadlessMultiselectExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
