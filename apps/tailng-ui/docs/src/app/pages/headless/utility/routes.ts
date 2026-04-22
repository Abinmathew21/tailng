import type { Routes } from '@angular/router';
import {
  HEADLESS_UTILITY_GROUP,
  toHeadlessDocsRouteData,
} from '../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const avatarItem = group.items.find((item) => item.slug === 'avatar');
if (avatarItem === undefined) {
  throw new Error('Missing "avatar" in headless utility docs group.');
}
const codeblockItem = group.items.find((item) => item.slug === 'codeblock');
if (codeblockItem === undefined) {
  throw new Error('Missing "codeblock" in headless utility docs group.');
}
const copybuttonItem = group.items.find((item) => item.slug === 'copybutton');
if (copybuttonItem === undefined) {
  throw new Error('Missing "copybutton" in headless utility docs group.');
}
const buttonItem = group.items.find((item) => item.slug === 'button');
if (buttonItem === undefined) {
  throw new Error('Missing "button" in headless utility docs group.');
}
const badgeItem = group.items.find((item) => item.slug === 'badge');
if (badgeItem === undefined) {
  throw new Error('Missing "badge" in headless utility docs group.');
}
const tagItem = group.items.find((item) => item.slug === 'tag');
if (tagItem === undefined) {
  throw new Error('Missing "tag" in headless utility docs group.');
}

const dedicatedUtilitySlugs = new Set([
  avatarItem.slug,
  codeblockItem.slug,
  copybuttonItem.slug,
  buttonItem.slug,
  badgeItem.slug,
  tagItem.slug,
]);

export const HEADLESS_UTILITY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  {
    path: 'avatar',
    loadChildren: () =>
      import('./avatar/routes').then((module) => module.HEADLESS_UTILITY_AVATAR_ROUTES),
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
  {
    path: 'button',
    loadChildren: () =>
      import('./button/routes').then((module) => module.HEADLESS_UTILITY_BUTTON_ROUTES),
  },
  {
    path: 'badge',
    loadChildren: () =>
      import('./badge/routes').then((module) => module.HEADLESS_UTILITY_BADGE_ROUTES),
  },
  {
    path: 'tag',
    loadChildren: () =>
      import('./tag/routes').then((module) => module.HEADLESS_UTILITY_TAG_ROUTES),
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
