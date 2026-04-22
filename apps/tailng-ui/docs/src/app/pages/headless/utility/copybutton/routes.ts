import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const copybuttonItem = group.items.find((item) => item.slug === 'copybutton');
if (copybuttonItem === undefined) {
  throw new Error('Missing "copybutton" in headless utility docs group.');
}

export const HEADLESS_UTILITY_COPYBUTTON_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, copybuttonItem),
    loadComponent: () =>
      import('./copybutton-page.component').then((module) => module.HeadlessCopybuttonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/copybutton-overview-page.component').then(
            (module) => module.HeadlessCopybuttonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/copybutton-api-page.component').then(
            (module) => module.HeadlessCopybuttonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/copybutton-styling-page.component').then(
            (module) => module.HeadlessCopybuttonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/copybutton-examples-page.component').then(
            (module) => module.HeadlessCopybuttonExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
