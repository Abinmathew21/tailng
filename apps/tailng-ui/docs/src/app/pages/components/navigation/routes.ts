import type { Routes } from '@angular/router';
import {
  COMPONENTS_NAVIGATION_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
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
const landingItems = group.items.filter(
  (item) =>
    item.slug !== menubarItem.slug &&
    item.slug !== menuItem.slug &&
    item.slug !== contextMenuItem.slug,
);

export const COMPONENTS_NAVIGATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
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
  ...landingItems.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/navigation-landing-page.component').then(
        (module) => module.NavigationLandingPageComponent,
      ),
  })),
];
