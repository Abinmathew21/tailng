import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const yearpickerItem = group.items.find((item) => item.slug === 'yearpicker');
if (yearpickerItem === undefined) {
  throw new Error('Missing "yearpicker" in components form docs group.');
}

export const COMPONENTS_FORM_YEARPICKER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, yearpickerItem),
    loadComponent: () =>
      import('./yearpicker-page.component').then((module) => module.YearpickerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/yearpicker-overview-page.component').then(
            (module) => module.YearpickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/yearpicker-api-page.component').then(
            (module) => module.YearpickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/yearpicker-styling-page.component').then(
            (module) => module.YearpickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/yearpicker-examples-page.component').then(
            (module) => module.YearpickerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
