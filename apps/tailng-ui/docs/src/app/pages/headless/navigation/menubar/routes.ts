import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const menubarItem = group.items.find((item) => item.slug === 'menubar');
if (menubarItem === undefined) {
  throw new Error('Missing "menubar" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_MENUBAR_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, menubarItem),
    loadComponent: () =>
      import('./menubar-page.component').then((module) => module.HeadlessMenubarPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/menubar-overview-page.component').then(
            (module) => module.HeadlessMenubarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/menubar-api-page.component').then(
            (module) => module.HeadlessMenubarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/menubar-styling-page.component').then(
            (module) => module.HeadlessMenubarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/menubar-examples-page.component').then(
            (module) => module.HeadlessMenubarExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
