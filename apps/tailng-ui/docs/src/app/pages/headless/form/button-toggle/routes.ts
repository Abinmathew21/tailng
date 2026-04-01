import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const buttonToggleItem = group.items.find((item) => item.slug === 'button-toggle');
if (buttonToggleItem === undefined) {
  throw new Error('Missing "button-toggle" in headless form docs group.');
}

export const HEADLESS_FORM_BUTTON_TOGGLE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, buttonToggleItem),
    loadComponent: () =>
      import('./button-toggle-page.component').then(
        (module) => module.HeadlessButtonTogglePageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-button-toggle-overview-page.component').then(
            (module) => module.HeadlessButtonToggleOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-button-toggle-api-page.component').then(
            (module) => module.HeadlessButtonToggleApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-button-toggle-styling-page.component').then(
            (module) => module.HeadlessButtonToggleStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-button-toggle-examples-page.component').then(
            (module) => module.HeadlessButtonToggleExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
