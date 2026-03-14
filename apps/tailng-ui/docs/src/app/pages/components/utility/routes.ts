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

const avatarItem = group.items.find((item) => item.slug === 'avatar');
if (avatarItem === undefined) {
  throw new Error('Missing "avatar" in components utility docs group.');
}

const codeblockItem = group.items.find((item) => item.slug === 'codeblock');
if (codeblockItem === undefined) {
  throw new Error('Missing "codeblock" in components utility docs group.');
}

const badgeItem = group.items.find((item) => item.slug === 'badge');
if (badgeItem === undefined) {
  throw new Error('Missing "badge" in components utility docs group.');
}

const tagItem = group.items.find((item) => item.slug === 'tag');
if (tagItem === undefined) {
  throw new Error('Missing "tag" in components utility docs group.');
}

const copybuttonItem = group.items.find((item) => item.slug === 'copybutton');
if (copybuttonItem === undefined) {
  throw new Error('Missing "copybutton" in components utility docs group.');
}

const buttonItem = group.items.find((item) => item.slug === 'button');
if (buttonItem === undefined) {
  throw new Error('Missing "button" in components utility docs group.');
}

const utilityLandingSlugs = new Set([
  avatarItem.slug,
  badgeItem.slug,
  tagItem.slug,
  codeblockItem.slug,
  copybuttonItem.slug,
  buttonItem.slug,
]);

export const COMPONENTS_UTILITY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: avatarItem.slug,
    loadChildren: () =>
      import('./avatar/routes').then((module) => module.COMPONENTS_UTILITY_AVATAR_ROUTES),
  },
  {
    path: badgeItem.slug,
    loadChildren: () =>
      import('./badge/routes').then((module) => module.COMPONENTS_UTILITY_BADGE_ROUTES),
  },
  {
    path: tagItem.slug,
    loadChildren: () =>
      import('./tag/routes').then((module) => module.COMPONENTS_UTILITY_TAG_ROUTES),
  },
  {
    path: codeblockItem.slug,
    loadChildren: () =>
      import('./codeblock/routes').then((module) => module.COMPONENTS_UTILITY_CODEBLOCK_ROUTES),
  },
  {
    path: copybuttonItem.slug,
    loadChildren: () =>
      import('./copybutton/routes').then(
        (module) => module.COMPONENTS_UTILITY_COPYBUTTON_ROUTES,
      ),
  },
  {
    path: buttonItem.slug,
    loadChildren: () =>
      import('./button/routes').then((module) => module.COMPONENTS_UTILITY_BUTTON_ROUTES),
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
