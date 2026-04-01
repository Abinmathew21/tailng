import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const labelItem = group.items.find((item) => item.slug === 'label');
if (labelItem === undefined) {
  throw new Error('Missing "label" in headless form docs group.');
}

export const HEADLESS_FORM_LABEL_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, labelItem),
    loadComponent: () =>
      import('./label-page.component').then((module) => module.HeadlessLabelPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/headless-label-overview-page.component').then(
            (module) => module.HeadlessLabelOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/headless-label-api-page.component').then(
            (module) => module.HeadlessLabelApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/headless-label-styling-page.component').then(
            (module) => module.HeadlessLabelStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/headless-label-examples-page.component').then(
            (module) => module.HeadlessLabelExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
