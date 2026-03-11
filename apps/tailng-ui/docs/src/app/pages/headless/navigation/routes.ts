import type { Routes } from '@angular/router';
import {
  HEADLESS_NAVIGATION_GROUP,
  toHeadlessDocsRouteData,
} from '../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;

export const HEADLESS_NAVIGATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toHeadlessDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/navigation-landing-page.component').then(
        (module) => module.NavigationLandingPageComponent,
      ),
  })),
];
