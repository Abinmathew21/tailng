import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const toggleItem = group.items.find((item) => item.slug === 'toggle');
if (toggleItem === undefined) {
  throw new Error('Missing "toggle" in headless form docs group.');
}

export const HEADLESS_FORM_TOGGLE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, toggleItem),
    loadComponent: () =>
      import('./toggle-page.component').then((module) => module.HeadlessTogglePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-toggle-overview-page.component').then(
            (module) => module.HeadlessToggleOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-toggle-api-page.component').then(
            (module) => module.HeadlessToggleApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-toggle-styling-page.component').then(
            (module) => module.HeadlessToggleStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-toggle-examples-page.component').then(
            (module) => module.HeadlessToggleExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
