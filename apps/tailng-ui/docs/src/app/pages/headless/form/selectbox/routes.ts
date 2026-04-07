import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const selectboxItem = group.items.find((item) => item.slug === 'selectbox');
if (selectboxItem === undefined) {
  throw new Error('Missing "selectbox" in headless form docs group.');
}

export const HEADLESS_FORM_SELECTBOX_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, selectboxItem),
    loadComponent: () =>
      import('./selectbox-page.component').then((module) => module.HeadlessSelectboxPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/selectbox-overview-page.component').then(
            (module) => module.HeadlessSelectboxOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/selectbox-api-page.component').then(
            (module) => module.HeadlessSelectboxApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/selectbox-styling-page.component').then(
            (module) => module.HeadlessSelectboxStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/selectbox-examples-page.component').then(
            (module) => module.HeadlessSelectboxExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
