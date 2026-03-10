import type { Routes } from '@angular/router';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_GETTING_STARTED_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Components getting-started docs are empty.');
}

const plainCssSetupItem = group.items.find((item) => item.slug === 'plain-css-setup');
if (plainCssSetupItem === undefined) {
  throw new Error('Missing "plain-css-setup" in components getting-started docs group.');
}

const tailwindSetupItem = group.items.find((item) => item.slug === 'tailwind-setup');
if (tailwindSetupItem === undefined) {
  throw new Error('Missing "tailwind-setup" in components getting-started docs group.');
}

const installationItem = group.items.find((item) => item.slug === 'installation');
if (installationItem === undefined) {
  throw new Error('Missing "installation" in components getting-started docs group.');
}

const landingPageSlugs = new Set([
  plainCssSetupItem.slug,
  tailwindSetupItem.slug,
  installationItem.slug,
]);

export const COMPONENTS_GETTING_STARTED_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: installationItem.slug,
    data: toComponentsDocsRouteData(group, installationItem),
    loadComponent: () =>
      import('./installation/installation-page.component').then((m) => m.InstallationPageComponent),
  },
  {
    path: plainCssSetupItem.slug,
    data: toComponentsDocsRouteData(group, plainCssSetupItem),
    loadComponent: () =>
      import('./plain-css-setup/plain-css-setup-page.component').then(
        (module) => module.PlainCssSetupPageComponent,
      ),
  },
  {
    path: tailwindSetupItem.slug,
    data: toComponentsDocsRouteData(group, tailwindSetupItem),
    loadComponent: () =>
      import('./tailwind-setup/tailwind-setup-page.component').then(
        (module) => module.TailwindSetupPageComponent,
      ),
  },
  ...group.items
    .filter((item) => !landingPageSlugs.has(item.slug))
    .map((item) => ({
      path: item.slug,
      data: toComponentsDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/getting-started-landing-page.component').then(
          (module) => module.GettingStartedLandingPageComponent,
        ),
    })),
];
