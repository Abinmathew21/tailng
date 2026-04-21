import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;
const cardItem = group.items.find((item) => item.slug === 'card');
if (cardItem === undefined) {
  throw new Error('Missing "card" in headless layout docs group.');
}

export const HEADLESS_LAYOUT_CARD_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, cardItem),
    loadComponent: () =>
      import('./card-page.component').then((module) => module.HeadlessCardPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/card-overview-page.component').then(
            (module) => module.HeadlessCardOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/card-api-page.component').then(
            (module) => module.HeadlessCardApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/card-styling-page.component').then(
            (module) => module.HeadlessCardStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/card-examples-page.component').then(
            (module) => module.HeadlessCardExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
