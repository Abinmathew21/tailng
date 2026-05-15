import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const numberRangeItem = group.items.find((item) => item.slug === 'number-range');
if (numberRangeItem === undefined) {
  throw new Error('Missing "number-range" in components form docs group.');
}

export const COMPONENTS_FORM_NUMBER_RANGE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, numberRangeItem),
    loadComponent: () =>
      import('./number-range-page.component').then(
        (module) => module.NumberRangePageComponent,
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
          import('./sections/overview/number-range-overview-page.component').then(
            (module) => module.NumberRangeOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/number-range-api-page.component').then(
            (module) => module.NumberRangeApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/number-range-styling-page.component').then(
            (module) => module.NumberRangeStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/number-range-examples-page.component').then(
            (module) => module.NumberRangeExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
