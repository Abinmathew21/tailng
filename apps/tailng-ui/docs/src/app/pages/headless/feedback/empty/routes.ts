import type { Routes } from '@angular/router';
import { HEADLESS_FEEDBACK_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FEEDBACK_GROUP;
const emptyItem = group.items.find((item) => item.slug === 'empty');
if (emptyItem === undefined) {
  throw new Error('Missing "empty" in headless feedback docs group.');
}

export const HEADLESS_FEEDBACK_EMPTY_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, emptyItem),
    loadComponent: () =>
      import('./empty-page.component').then((module) => module.HeadlessEmptyPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/empty-overview-page.component').then(
            (module) => module.HeadlessEmptyOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/empty-api-page.component').then(
            (module) => module.HeadlessEmptyApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/empty-styling-page.component').then(
            (module) => module.HeadlessEmptyStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/empty-examples-page.component').then(
            (module) => module.HeadlessEmptyExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
