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

const signalFormDemoItem = group.items.find((item) => item.slug === 'signal-form-demo');
if (signalFormDemoItem === undefined) {
  throw new Error('Missing "signal-form-demo" in components getting-started docs group.');
}

const configureThemeItem = group.items.find((item) => item.slug === 'configure-theme');
if (configureThemeItem === undefined) {
  throw new Error('Missing "configure-theme" in components getting-started docs group.');
}

const landingPageSlugs = new Set([
  plainCssSetupItem.slug,
  tailwindSetupItem.slug,
  installationItem.slug,
  signalFormDemoItem.slug,
  configureThemeItem.slug,
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
    path: configureThemeItem.slug,
    data: toComponentsDocsRouteData(group, configureThemeItem),
    loadComponent: () =>
      import('./configure-theme/configure-theme-page.component').then(
        (m) => m.ConfigureThemePageComponent,
      ),
  },
  {
    path: signalFormDemoItem.slug,
    data: toComponentsDocsRouteData(group, signalFormDemoItem),
    loadComponent: () =>
      import('./signal-form-demo/signal-form-demo-page.component').then(
        (module) => module.SignalFormDemoPageComponent,
      ),
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
