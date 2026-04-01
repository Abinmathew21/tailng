import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const switchItem = group.items.find((item) => item.slug === 'switch');
if (switchItem === undefined) {
  throw new Error('Missing "switch" in headless form docs group.');
}

export const HEADLESS_FORM_SWITCH_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, switchItem),
    loadComponent: () =>
      import('./switch-page.component').then((module) => module.HeadlessSwitchPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-switch-overview-page.component').then(
            (module) => module.HeadlessSwitchOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-switch-api-page.component').then(
            (module) => module.HeadlessSwitchApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-switch-styling-page.component').then(
            (module) => module.HeadlessSwitchStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-switch-examples-page.component').then(
            (module) => module.HeadlessSwitchExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
