import type { Routes } from '@angular/router';
import {
  HEADLESS_UTILITY_GROUP,
  toHeadlessDocsRouteData,
} from '../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;

export const HEADLESS_UTILITY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toHeadlessDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/utility-landing-page.component').then(
        (module) => module.UtilityLandingPageComponent,
      ),
  })),
];
