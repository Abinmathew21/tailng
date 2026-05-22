import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const monthDaypickerItem = group.items.find((item) => item.slug === 'month-daypicker');
if (monthDaypickerItem === undefined) {
  throw new Error('Missing "month-daypicker" in components form docs group.');
}

export const COMPONENTS_FORM_MONTH_DAYPICKER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, monthDaypickerItem),
    loadComponent: () =>
      import('./month-daypicker-page.component').then((module) => module.MonthDaypickerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/month-daypicker-overview-page.component').then(
            (module) => module.MonthDaypickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/month-daypicker-api-page.component').then(
            (module) => module.MonthDaypickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/month-daypicker-styling-page.component').then(
            (module) => module.MonthDaypickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/month-daypicker-examples-page.component').then(
            (module) => module.MonthDaypickerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
