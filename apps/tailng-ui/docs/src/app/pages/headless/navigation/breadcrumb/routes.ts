import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const breadcrumbItem = group.items.find((item) => item.slug === 'breadcrumb');
if (breadcrumbItem === undefined) {
  throw new Error('Missing "breadcrumb" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_BREADCRUMB_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, breadcrumbItem),
    loadComponent: () =>
      import('./breadcrumb-page.component').then((module) => module.HeadlessBreadcrumbPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/breadcrumb-overview-page.component').then(
            (module) => module.HeadlessBreadcrumbOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/breadcrumb-api-page.component').then(
            (module) => module.HeadlessBreadcrumbApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/breadcrumb-styling-page.component').then(
            (module) => module.HeadlessBreadcrumbStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/breadcrumb-examples-page.component').then(
            (module) => module.HeadlessBreadcrumbExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
