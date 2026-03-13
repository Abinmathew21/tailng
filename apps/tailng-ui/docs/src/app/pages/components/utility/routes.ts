import type { Routes } from '@angular/router';
import {
  COMPONENTS_UTILITY_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Components utility docs are empty.');
}

const codeblockItem = group.items.find((item) => item.slug === 'codeblock');
if (codeblockItem === undefined) {
  throw new Error('Missing "codeblock" in components utility docs group.');
}

const utilityLandingSlugs = new Set([codeblockItem.slug]);

export const COMPONENTS_UTILITY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: codeblockItem.slug,
    loadChildren: () =>
      import('./codeblock/routes').then((module) => module.COMPONENTS_UTILITY_CODEBLOCK_ROUTES),
  },
  ...group.items
    .filter((item) => !utilityLandingSlugs.has(item.slug))
    .map((item) => ({
      path: item.slug,
      data: toComponentsDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/utility-landing-page.component').then(
          (module) => module.UtilityLandingPageComponent,
        ),
    })),
];
