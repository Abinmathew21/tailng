import type { Routes } from '@angular/router';
import {
  COMPONENTS_UTILITY_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;

export const COMPONENTS_UTILITY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/utility-landing-page.component').then(
        (module) => module.UtilityLandingPageComponent,
      ),
  })),
];
