import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((module) => module.HomePageComponent),
  },
  {
    path: 'theme',
    loadComponent: () =>
      import('./pages/theme/theme-playground-page.component').then(
        (module) => module.ThemePlaygroundPageComponent,
      ),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/primitives/button-demo/button-playground-page.component').then(
        (module) => module.ButtonPlaygroundPageComponent,
      ),
  },
  {
    path: 'icons',
    loadComponent: () =>
      import('./pages/icons/icon-demo/icon-playground-page.component').then(
        (module) => module.IconPlaygroundPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
