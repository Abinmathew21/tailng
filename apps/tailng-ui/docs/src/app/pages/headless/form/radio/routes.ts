import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const radioItem = group.items.find((item) => item.slug === 'radio');
if (radioItem === undefined) {
  throw new Error('Missing "radio" in headless form docs group.');
}

export const HEADLESS_FORM_RADIO_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, radioItem),
    loadComponent: () =>
      import('./radio-page.component').then((module) => module.HeadlessRadioPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-radio-overview-page.component').then(
            (module) => module.HeadlessRadioOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-radio-api-page.component').then(
            (module) => module.HeadlessRadioApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-radio-styling-page.component').then(
            (module) => module.HeadlessRadioStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-radio-examples-page.component').then(
            (module) => module.HeadlessRadioExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
