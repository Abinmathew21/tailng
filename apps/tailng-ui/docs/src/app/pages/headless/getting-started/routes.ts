import type { Routes } from '@angular/router';
import {
  HEADLESS_GETTING_STARTED_GROUP,
  toHeadlessDocsRouteData,
} from '../headless-docs.data';

const group = HEADLESS_GETTING_STARTED_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Headless getting-started docs are empty.');
}

const quickStartItem = group.items.find((item) => item.slug === 'quick-start');
if (quickStartItem === undefined) {
  throw new Error('Missing "quick-start" in headless getting-started docs group.');
}

const installationItem = group.items.find((item) => item.slug === 'installation');
if (installationItem === undefined) {
  throw new Error('Missing "installation" in headless getting-started docs group.');
}

const plainCssSetupItem = group.items.find((item) => item.slug === 'plain-css-setup');
if (plainCssSetupItem === undefined) {
  throw new Error('Missing "plain-css-setup" in headless getting-started docs group.');
}

const tailwindSetupItem = group.items.find((item) => item.slug === 'tailwind-setup');
if (tailwindSetupItem === undefined) {
  throw new Error('Missing "tailwind-setup" in headless getting-started docs group.');
}

export const HEADLESS_GETTING_STARTED_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: quickStartItem.slug,
    data: toHeadlessDocsRouteData(group, quickStartItem),
    loadComponent: () =>
      import('./quick-start/quick-start-page.component').then(
        (module) => module.QuickStartPageComponent,
      ),
  },
  {
    path: installationItem.slug,
    data: toHeadlessDocsRouteData(group, installationItem),
    loadComponent: () =>
      import('./installation/installation-page.component').then(
        (module) => module.InstallationPageComponent,
      ),
  },
  {
    path: plainCssSetupItem.slug,
    data: toHeadlessDocsRouteData(group, plainCssSetupItem),
    loadComponent: () =>
      import('./plain-css-setup/plain-css-setup-page.component').then(
        (module) => module.PlainCssSetupPageComponent,
      ),
  },
  {
    path: tailwindSetupItem.slug,
    data: toHeadlessDocsRouteData(group, tailwindSetupItem),
    loadComponent: () =>
      import('./tailwind-setup/tailwind-setup-page.component').then(
        (module) => module.TailwindSetupPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: defaultItem.slug,
  },
];
