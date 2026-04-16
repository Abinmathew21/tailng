import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const menuItem = group.items.find((item) => item.slug === 'menu');
if (menuItem === undefined) {
  throw new Error('Missing "menu" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_MENU_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, menuItem),
    loadComponent: () =>
      import('./menu-page.component').then((module) => module.HeadlessMenuPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/index').then((module) => module.HeadlessMenuOverviewPageComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/index').then((module) => module.HeadlessMenuApiPageComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/index').then((module) => module.HeadlessMenuStylingPageComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/index').then(
            (module) => module.HeadlessMenuExamplesPageComponent as Type<unknown>,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
