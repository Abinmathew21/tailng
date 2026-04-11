import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const datepickerItem = group.items.find((item) => item.slug === 'datepicker');
if (datepickerItem === undefined) {
  throw new Error('Missing "datepicker" in headless form docs group.');
}

export const HEADLESS_FORM_DATEPICKER_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, datepickerItem),
    loadComponent: () =>
      import('./datepicker-page.component').then((module) => module.HeadlessDatepickerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/datepicker-overview-page.component').then(
            (module) => module.HeadlessDatepickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/datepicker-api-page.component').then(
            (module) => module.HeadlessDatepickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/datepicker-styling-page.component').then(
            (module) => module.HeadlessDatepickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/datepicker-examples-page.component').then(
            (module) => module.HeadlessDatepickerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
