import type { Routes } from '@angular/router';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
} from '../component-docs.data';

const group = COMPONENTS_GETTING_STARTED_GROUP;

export const COMPONENTS_GETTING_STARTED_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: group.items[0]!.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./landing/getting-started-landing-page.component').then(
        (module) => module.GettingStartedLandingPageComponent,
      ),
  })),
];
