import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const dateRangePickerItem = group.items.find((item) => item.slug === 'date-range-picker');
if (dateRangePickerItem === undefined) {
  throw new Error('Missing "date-range-picker" in components form docs group.');
}

export const COMPONENTS_FORM_DATE_RANGE_PICKER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, dateRangePickerItem),
    loadComponent: () =>
      import('./date-range-picker-page.component').then((module) => module.DateRangePickerPageComponent),
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
            (module) => module.DateRangePickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/date-range-picker-api-page.component').then(
            (module) => module.DateRangePickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/date-range-picker-styling-page.component').then(
            (module) => module.DateRangePickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/date-range-picker-examples-page.component').then(
            (module) => module.DateRangePickerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
