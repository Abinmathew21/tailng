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
    path: 'input',
    loadComponent: () =>
      import('./pages/primitives/input-demo/input-playground-page.component').then(
        (module) => module.InputPlaygroundPageComponent,
      ),
  },
  {
    path: 'radio',
    loadComponent: () =>
      import('./pages/primitives/radio-demo/radio-playground-page.component').then(
        (module) => module.RadioPlaygroundPageComponent,
      ),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/primitives/checkbox-demo/checkbox-playground-page.component').then(
        (module) => module.CheckboxPlaygroundPageComponent,
      ),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./pages/primitives/textarea-demo/textarea-playground-page.component').then(
        (module) => module.TextareaPlaygroundPageComponent,
      ),
  },
  {
    path: 'listbox',
    loadComponent: () =>
      import('./pages/primitives/listbox-demo/listbox-playground-page.component').then(
        (module) => module.ListboxPlaygroundPageComponent,
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
