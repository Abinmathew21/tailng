import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const badgeItem = group.items.find((item) => item.slug === 'badge');
if (badgeItem === undefined) {
  throw new Error('Missing "badge" in headless utility docs group.');
}

export const HEADLESS_UTILITY_BADGE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, badgeItem),
    loadComponent: () =>
      import('./badge-page.component').then((module) => module.HeadlessBadgePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/badge-overview-page.component').then(
            (module) => module.HeadlessBadgeOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/badge-api-page.component').then(
            (module) => module.HeadlessBadgeApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/badge-styling-page.component').then(
            (module) => module.HeadlessBadgeStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/badge-examples-page.component').then(
            (module) => module.HeadlessBadgeExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
