import type { Routes } from '@angular/router';
import { HEADLESS_FEEDBACK_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FEEDBACK_GROUP;
const progressSpinnerItem = group.items.find((item) => item.slug === 'progress-spinner');
if (progressSpinnerItem === undefined) {
  throw new Error('Missing "progress-spinner" in headless feedback docs group.');
}

export const HEADLESS_FEEDBACK_PROGRESS_SPINNER_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, progressSpinnerItem),
    loadComponent: () =>
      import('./progress-spinner-page.component').then(
        (module) => module.HeadlessProgressSpinnerPageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/progress-spinner-overview-page.component').then(
            (module) => module.HeadlessProgressSpinnerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/progress-spinner-api-page.component').then(
            (module) => module.HeadlessProgressSpinnerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/progress-spinner-styling-page.component').then(
            (module) => module.HeadlessProgressSpinnerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/progress-spinner-examples-page.component').then(
            (module) => module.HeadlessProgressSpinnerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
