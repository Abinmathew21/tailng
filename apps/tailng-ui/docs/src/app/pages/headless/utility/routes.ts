import type { Routes } from '@angular/router';
import {
  HEADLESS_UTILITY_GROUP,
  toHeadlessDocsRouteData,
} from '../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const codeblockItem = group.items.find((item) => item.slug === 'codeblock');
if (codeblockItem === undefined) {
  throw new Error('Missing "codeblock" in headless utility docs group.');
}
const copybuttonItem = group.items.find((item) => item.slug === 'copybutton');
if (copybuttonItem === undefined) {
  throw new Error('Missing "copybutton" in headless utility docs group.');
}

const dedicatedUtilitySlugs = new Set([codeblockItem.slug, copybuttonItem.slug]);

export const HEADLESS_UTILITY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'codeblock',
    loadChildren: () =>
      import('./codeblock/routes').then((module) => module.HEADLESS_UTILITY_CODEBLOCK_ROUTES),
  },
  {
    path: 'copybutton',
    loadChildren: () =>
      import('./copybutton/routes').then((module) => module.HEADLESS_UTILITY_COPYBUTTON_ROUTES),
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toHeadlessDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/utility-landing-page.component').then(
        (module) => module.UtilityLandingPageComponent,
      ),
  })).filter((route) => !dedicatedUtilitySlugs.has(route.path ?? '')),
];
