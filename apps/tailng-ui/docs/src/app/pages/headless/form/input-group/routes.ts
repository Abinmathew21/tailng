import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const inputGroupItem = group.items.find((item) => item.slug === 'input-group');
if (inputGroupItem === undefined) {
  throw new Error('Missing "input-group" in headless form docs group.');
}

export const HEADLESS_FORM_INPUT_GROUP_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, inputGroupItem),
    loadComponent: () =>
      import('./input-group-page.component').then((module) => module.HeadlessInputGroupPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/input-group-overview-page.component').then(
            (module) => module.HeadlessInputGroupOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/input-group-api-page.component').then(
            (module) => module.HeadlessInputGroupApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/input-group-styling-page.component').then(
            (module) => module.HeadlessInputGroupStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/input-group-examples-page.component').then(
            (module) => module.HeadlessInputGroupExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
