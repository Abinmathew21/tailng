import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const paginationItem = group.items.find((item) => item.slug === 'pagination');
if (paginationItem === undefined) {
  throw new Error('Missing "pagination" in headless navigation docs group.');
}

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
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/routes').then((module) => module.HEADLESS_NAVIGATION_TABS_ROUTES),
  },
  {
    path: 'tree',
    loadChildren: () =>
      import('./tree/routes').then((module) => module.HEADLESS_NAVIGATION_TREE_ROUTES),
  },
  {
    path: paginationItem.slug,
    loadChildren: () =>
      import('./pagination/routes').then((module) => module.HEADLESS_NAVIGATION_PAGINATION_ROUTES),
  },
  ...group.items
    .filter(
      (item) =>
        item.slug !== 'menubar' &&
        item.slug !== 'menu' &&
        item.slug !== 'context-menu' &&
        item.slug !== 'breadcrumb' &&
        item.slug !== 'tabs' &&
        item.slug !== 'tree' &&
        item.slug !== 'pagination',
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
