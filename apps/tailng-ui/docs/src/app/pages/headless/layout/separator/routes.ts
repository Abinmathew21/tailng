import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;
const separatorItem = group.items.find((item) => item.slug === 'separator');
if (separatorItem === undefined) {
  throw new Error('Missing "separator" in headless layout docs group.');
}

export const HEADLESS_LAYOUT_SEPARATOR_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, separatorItem),
    loadComponent: () =>
      import('./separator-page.component').then((module) => module.HeadlessSeparatorPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/separator-overview-page.component').then(
            (module) => module.HeadlessSeparatorOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/separator-api-page.component').then(
            (module) => module.HeadlessSeparatorApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/separator-styling-page.component').then(
            (module) => module.HeadlessSeparatorStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/separator-examples-page.component').then(
            (module) => module.HeadlessSeparatorExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
