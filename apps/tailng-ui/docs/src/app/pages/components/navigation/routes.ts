import type { Routes } from '@angular/router';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const breadcrumbItem = group.items.find((item) => item.slug === 'breadcrumb');
if (breadcrumbItem === undefined) {
  throw new Error('Missing "breadcrumb" in components navigation docs group.');
}
const tabsItem = group.items.find((item) => item.slug === 'tabs');
if (tabsItem === undefined) {
  throw new Error('Missing "tabs" in components navigation docs group.');
}
const menubarItem = group.items.find((item) => item.slug === 'menubar');
if (menubarItem === undefined) {
  throw new Error('Missing "menubar" in components navigation docs group.');
}
const menuItem = group.items.find((item) => item.slug === 'menu');
if (menuItem === undefined) {
  throw new Error('Missing "menu" in components navigation docs group.');
}
const contextMenuItem = group.items.find((item) => item.slug === 'context-menu');
if (contextMenuItem === undefined) {
  throw new Error('Missing "context-menu" in components navigation docs group.');
}
const treeItem = group.items.find((item) => item.slug === 'tree');
if (treeItem === undefined) {
  throw new Error('Missing "tree" in components navigation docs group.');
}
const paginationItem = group.items.find((item) => item.slug === 'pagination');
if (paginationItem === undefined) {
  throw new Error('Missing "pagination" in components navigation docs group.');
}
const landingItems = group.items.filter(
  (item) =>
    item.slug !== breadcrumbItem.slug &&
    item.slug !== tabsItem.slug &&
    item.slug !== menubarItem.slug &&
    item.slug !== menuItem.slug &&
    item.slug !== contextMenuItem.slug &&
    item.slug !== treeItem.slug &&
    item.slug !== paginationItem.slug,
);

export const COMPONENTS_NAVIGATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: breadcrumbItem.slug,
    loadChildren: () =>
      import('./breadcrumb/routes').then(
        (module) => module.COMPONENTS_NAVIGATION_BREADCRUMB_ROUTES,
      ),
  },
  {
    path: tabsItem.slug,
    loadChildren: () =>
      import('./tabs/routes').then((module) => module.COMPONENTS_NAVIGATION_TABS_ROUTES),
  },
  {
    path: menubarItem.slug,
    loadChildren: () =>
      import('./menubar/routes').then((module) => module.COMPONENTS_NAVIGATION_MENUBAR_ROUTES),
  },
  {
    path: menuItem.slug,
    loadChildren: () =>
      import('./menu/routes').then((module) => module.COMPONENTS_NAVIGATION_MENU_ROUTES),
  },
  {
    path: contextMenuItem.slug,
    loadChildren: () =>
      import('./context-menu/routes').then(
        (module) => module.COMPONENTS_NAVIGATION_CONTEXT_MENU_ROUTES,
      ),
  },
  {
    path: treeItem.slug,
    loadChildren: () =>
      import('./tree/routes').then((module) => module.COMPONENTS_NAVIGATION_TREE_ROUTES),
  },
  {
    path: paginationItem.slug,
    data: toComponentsDocsRouteData(group, paginationItem),
    loadComponent: () =>
      import('./pagination/pagination-page.component').then(
        (module) => module.PaginationPageComponent,
      ),
  },
  ...landingItems.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/navigation-landing-page.component').then(
        (module) => module.NavigationLandingPageComponent,
      ),
  })),
];
