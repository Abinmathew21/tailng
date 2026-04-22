import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const tagItem = group.items.find((item) => item.slug === 'tag');
if (tagItem === undefined) {
  throw new Error('Missing "tag" in headless utility docs group.');
}

export const HEADLESS_UTILITY_TAG_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, tagItem),
    loadComponent: () =>
      import('./tag-page.component').then((module) => module.HeadlessTagPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tag-overview-page.component').then(
            (module) => module.HeadlessTagOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tag-api-page.component').then(
            (module) => module.HeadlessTagApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tag-styling-page.component').then(
            (module) => module.HeadlessTagStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tag-examples-page.component').then(
            (module) => module.HeadlessTagExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
