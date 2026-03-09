import type { Routes } from '@angular/router';
import {
  COMPONENTS_NAVIGATION_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;

export const COMPONENTS_NAVIGATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/navigation-landing-page.component').then(
        (module) => module.NavigationLandingPageComponent,
      ),
  })),
];
