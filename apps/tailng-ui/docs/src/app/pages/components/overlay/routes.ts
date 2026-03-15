import type { Routes } from '@angular/router';
import {
  COMPONENTS_OVERLAY_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_OVERLAY_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Components overlay docs are empty.');
}

const dialogItem = group.items.find((item) => item.slug === 'dialog');
if (dialogItem === undefined) {
  throw new Error('Missing "dialog" in components overlay docs group.');
}

const landingItems = group.items.filter((item) => item.slug !== dialogItem.slug);

export const COMPONENTS_OVERLAY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: dialogItem.slug,
    loadChildren: () =>
      import('./dialog/routes').then((module) => module.COMPONENTS_OVERLAY_DIALOG_ROUTES),
  },
  ...landingItems.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/overlay-landing-page.component').then(
        (module) => module.OverlayLandingPageComponent,
      ),
  })),
];
