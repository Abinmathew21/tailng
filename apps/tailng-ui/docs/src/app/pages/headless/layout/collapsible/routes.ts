import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;
const collapsibleItem = group.items.find((item) => item.slug === 'collapsible');
if (collapsibleItem === undefined) {
  throw new Error('Missing "collapsible" in headless layout docs group.');
}

export const HEADLESS_LAYOUT_COLLAPSIBLE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, collapsibleItem),
    loadComponent: () =>
      import('./collapsible-page.component').then((module) => module.HeadlessCollapsiblePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/collapsible-overview-page.component').then(
            (module) => module.HeadlessCollapsibleOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/collapsible-api-page.component').then(
            (module) => module.HeadlessCollapsibleApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/collapsible-styling-page.component').then(
            (module) => module.HeadlessCollapsibleStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/collapsible-examples-page.component').then(
            (module) => module.HeadlessCollapsibleExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
