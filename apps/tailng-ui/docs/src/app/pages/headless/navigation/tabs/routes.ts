import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const tabsItem = group.items.find((item) => item.slug === 'tabs');
if (tabsItem === undefined) {
  throw new Error('Missing "tabs" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_TABS_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, tabsItem),
    loadComponent: () =>
      import('./tabs-page.component').then((module) => module.HeadlessTabsPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tabs-overview-page.component').then(
            (module) => module.HeadlessTabsOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tabs-api-page.component').then(
            (module) => module.HeadlessTabsApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tabs-styling-page.component').then(
            (module) => module.HeadlessTabsStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tabs-examples-page.component').then(
            (module) => module.HeadlessTabsExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
