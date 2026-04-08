import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const chipsItem = group.items.find((item) => item.slug === 'chips');
if (chipsItem === undefined) {
  throw new Error('Missing "chips" in headless form docs group.');
}

export const HEADLESS_FORM_CHIPS_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, chipsItem),
    loadComponent: () =>
      import('./chips-page.component').then((module) => module.HeadlessChipsPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/chips-overview-page.component').then(
            (module) => module.HeadlessChipsOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/chips-api-page.component').then(
            (module) => module.HeadlessChipsApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/chips-styling-page.component').then(
            (module) => module.HeadlessChipsStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/chips-examples-page.component').then(
            (module) => module.HeadlessChipsExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
