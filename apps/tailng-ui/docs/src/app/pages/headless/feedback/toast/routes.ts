import type { Routes } from '@angular/router';
import { HEADLESS_FEEDBACK_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FEEDBACK_GROUP;
const toastItem = group.items.find((item) => item.slug === 'toast');
if (toastItem === undefined) {
  throw new Error('Missing "toast" in headless feedback docs group.');
}

export const HEADLESS_FEEDBACK_TOAST_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, toastItem),
    loadComponent: () =>
      import('./toast-page.component').then((module) => module.HeadlessToastPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/toast-overview-page.component').then(
            (module) => module.HeadlessToastOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/toast-api-page.component').then(
            (module) => module.HeadlessToastApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/toast-styling-page.component').then(
            (module) => module.HeadlessToastStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/toast-examples-page.component').then(
            (module) => module.HeadlessToastExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
