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
const landingItems = group.items.filter((item) => item.slug !== menubarItem.slug);

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
  ...landingItems.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/navigation-landing-page.component').then(
        (module) => module.NavigationLandingPageComponent,
      ),
  })),
];
