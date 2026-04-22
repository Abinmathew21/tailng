import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const codeblockItem = group.items.find((item) => item.slug === 'codeblock');
if (codeblockItem === undefined) {
  throw new Error('Missing "codeblock" in headless utility docs group.');
}

export const HEADLESS_UTILITY_CODEBLOCK_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, codeblockItem),
    loadComponent: () =>
      import('./codeblock-page.component').then((module) => module.HeadlessCodeblockPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/codeblock-overview-page.component').then(
            (module) => module.HeadlessCodeblockOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/codeblock-api-page.component').then(
            (module) => module.HeadlessCodeblockApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/codeblock-styling-page.component').then(
            (module) => module.HeadlessCodeblockStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/codeblock-examples-page.component').then(
            (module) => module.HeadlessCodeblockExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
