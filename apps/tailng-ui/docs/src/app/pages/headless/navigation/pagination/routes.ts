import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const paginationItem = group.items.find((item) => item.slug === 'pagination');
if (paginationItem === undefined) {
  throw new Error('Missing "pagination" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_PAGINATION_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, paginationItem),
    loadComponent: () =>
      import('./headless-pagination-page.component').then(
        (module) => module.HeadlessPaginationPageComponent,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/pagination-overview-page.component').then(
            (module) => module.HeadlessPaginationOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/pagination-api-page.component').then(
            (module) => module.HeadlessPaginationApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/pagination-styling-page.component').then(
            (module) => module.HeadlessPaginationStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/pagination-examples-page.component').then(
            (module) => module.HeadlessPaginationExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
