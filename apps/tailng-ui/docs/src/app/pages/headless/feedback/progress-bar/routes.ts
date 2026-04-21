import type { Routes } from '@angular/router';
import { HEADLESS_FEEDBACK_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FEEDBACK_GROUP;
const progressBarItem = group.items.find((item) => item.slug === 'progress-bar');
if (progressBarItem === undefined) {
  throw new Error('Missing "progress-bar" in headless feedback docs group.');
}

export const HEADLESS_FEEDBACK_PROGRESS_BAR_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, progressBarItem),
    loadComponent: () =>
      import('./progress-bar-page.component').then(
        (module) => module.HeadlessProgressBarPageComponent,
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
          import('./sections/overview/progress-bar-overview-page.component').then(
            (module) => module.HeadlessProgressBarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/progress-bar-api-page.component').then(
            (module) => module.HeadlessProgressBarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/progress-bar-styling-page.component').then(
            (module) => module.HeadlessProgressBarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/progress-bar-examples-page.component').then(
            (module) => module.HeadlessProgressBarExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
