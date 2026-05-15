import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const dateRangePickerItem = group.items.find((item) => item.slug === 'date-range-picker');
if (dateRangePickerItem === undefined) {
  throw new Error('Missing "date-range-picker" in headless form docs group.');
}

export const HEADLESS_FORM_DATE_RANGE_PICKER_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, dateRangePickerItem),
    loadComponent: () =>
      import('./date-range-picker-page.component').then((module) => module.HeadlessDateRangePickerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/date-range-picker-overview-page.component').then(
            (module) => module.HeadlessDateRangePickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/date-range-picker-api-page.component').then(
            (module) => module.HeadlessDateRangePickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/date-range-picker-styling-page.component').then(
            (module) => module.HeadlessDateRangePickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/date-range-picker-examples-page.component').then(
            (module) => module.HeadlessDateRangePickerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
