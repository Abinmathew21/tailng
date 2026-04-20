import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const contextMenuItem = group.items.find((item) => item.slug === 'context-menu');
if (contextMenuItem === undefined) {
  throw new Error('Missing "context-menu" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_CONTEXT_MENU_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, contextMenuItem),
    loadComponent: () =>
      import('./context-menu-page.component').then(
        (module) => module.HeadlessContextMenuPageComponent,
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
          import('./sections/overview/context-menu-overview-page.component').then(
            (module) => module.HeadlessContextMenuOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/context-menu-api-page.component').then(
            (module) => module.HeadlessContextMenuApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/context-menu-styling-page.component').then(
            (module) => module.HeadlessContextMenuStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/context-menu-examples-page.component').then(
            (module) => module.HeadlessContextMenuExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
