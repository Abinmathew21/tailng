import type { Routes } from '@angular/router';
import { DEFAULT_THEME_DOCS_SEGMENT } from './theme-docs.data';

export const THEME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/theme-page.component').then((m) => m.ThemePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_THEME_DOCS_SEGMENT,
      },
      {
        path: 'guides',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'getting-started',
          },
          {
            path: 'getting-started',
            loadComponent: () =>
              import('./sections/overview/theme-overview-page.component').then(
                (m) => m.ThemeOverviewPageComponent,
              ),
          },
          {
            path: 'creating-a-new-theme',
            loadComponent: () =>
              import('./sections/guides/creating-a-new-theme/creating-a-new-theme-page.component').then(
                (m) => m.CreatingANewThemePageComponent,
              ),
          },
          {
            path: '**',
            redirectTo: 'getting-started',
          },
        ],
      },
      {
        path: 'tools',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'download-example-theme',
          },
          {
            path: 'download-example-theme',
            loadComponent: () =>
              import('./sections/tools/download-example-theme/download-example-theme-page.component').then(
                (m) => m.DownloadExampleThemePageComponent,
              ),
          },
          {
            path: 'theme-builder',
            loadComponent: () =>
              import('./sections/tools/theme-builder/theme-builder-page.component').then(
                (m) => m.ThemeBuilderPageComponent,
              ),
          },
          {
            path: '**',
            redirectTo: 'download-example-theme',
          },
        ],
      },
      {
        path: 'reference',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'api',
          },
          {
            path: 'api',
            loadComponent: () =>
              import('./sections/api/theme-api-page.component').then(
                (m) => m.ThemeApiPageComponent,
              ),
          },
          {
            path: 'styling',
            loadComponent: () =>
              import('./sections/styling/theme-styling-page.component').then(
                (m) => m.ThemeStylingPageComponent,
              ),
          },
          {
            path: 'examples',
            loadComponent: () =>
              import('./sections/examples/theme-examples-page.component').then(
                (m) => m.ThemeExamplesPageComponent,
              ),
          },
          {
            path: '**',
            redirectTo: 'api',
          },
        ],
      },
      {
        path: '**',
        redirectTo: DEFAULT_THEME_DOCS_SEGMENT,
      },
    ],
  },
];
