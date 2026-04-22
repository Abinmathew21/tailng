import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const buttonItem = group.items.find((item) => item.slug === 'button');
if (buttonItem === undefined) {
  throw new Error('Missing "button" in headless utility docs group.');
}

export const HEADLESS_UTILITY_BUTTON_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, buttonItem),
    loadComponent: () =>
      import('./button-page.component').then((module) => module.HeadlessButtonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/button-overview-page.component').then(
            (module) => module.HeadlessButtonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/button-api-page.component').then(
            (module) => module.HeadlessButtonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/button-styling-page.component').then(
            (module) => module.HeadlessButtonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/button-examples-page.component').then(
            (module) => module.HeadlessButtonExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
