import type { Routes } from '@angular/router';
import {
  HEADLESS_NAVIGATION_GROUP,
  toHeadlessDocsRouteData,
} from '../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;

export const HEADLESS_NAVIGATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'menubar',
    loadChildren: () =>
      import('./menubar/routes').then((module) => module.HEADLESS_NAVIGATION_MENUBAR_ROUTES),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./menu/routes').then((module) => module.HEADLESS_NAVIGATION_MENU_ROUTES),
  },
  {
    path: 'context-menu',
    loadChildren: () =>
      import('./context-menu/routes').then(
        (module) => module.HEADLESS_NAVIGATION_CONTEXT_MENU_ROUTES,
      ),
  },
  {
    path: 'breadcrumb',
    loadChildren: () =>
      import('./breadcrumb/routes').then((module) => module.HEADLESS_NAVIGATION_BREADCRUMB_ROUTES),
  },
  ...group.items
    .filter(
      (item) =>
        item.slug !== 'menubar' &&
        item.slug !== 'menu' &&
        item.slug !== 'context-menu' &&
        item.slug !== 'breadcrumb',
    )
    .map((item) => ({
      path: item.slug,
      data: toHeadlessDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/navigation-landing-page.component').then(
          (module) => module.NavigationLandingPageComponent,
        ),
    })),
];
