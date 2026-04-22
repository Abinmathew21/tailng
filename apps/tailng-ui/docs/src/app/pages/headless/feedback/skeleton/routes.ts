import type { Routes } from '@angular/router';
import { HEADLESS_FEEDBACK_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FEEDBACK_GROUP;
const skeletonItem = group.items.find((item) => item.slug === 'skeleton');
if (skeletonItem === undefined) {
  throw new Error('Missing "skeleton" in headless feedback docs group.');
}

export const HEADLESS_FEEDBACK_SKELETON_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, skeletonItem),
    loadComponent: () =>
      import('./skeleton-page.component').then((module) => module.HeadlessSkeletonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/skeleton-overview-page.component').then(
            (module) => module.HeadlessSkeletonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/skeleton-api-page.component').then(
            (module) => module.HeadlessSkeletonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/skeleton-styling-page.component').then(
            (module) => module.HeadlessSkeletonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/skeleton-examples-page.component').then(
            (module) => module.HeadlessSkeletonExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
