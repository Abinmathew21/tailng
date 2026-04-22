import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const avatarItem = group.items.find((item) => item.slug === 'avatar');
if (avatarItem === undefined) {
  throw new Error('Missing "avatar" in headless utility docs group.');
}

export const HEADLESS_UTILITY_AVATAR_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, avatarItem),
    loadComponent: () =>
      import('./avatar-page.component').then((module) => module.HeadlessAvatarPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/avatar-overview-page.component').then(
            (module) => module.HeadlessAvatarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/avatar-api-page.component').then(
            (module) => module.HeadlessAvatarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/avatar-styling-page.component').then(
            (module) => module.HeadlessAvatarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/avatar-examples-page.component').then(
            (module) => module.HeadlessAvatarExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
