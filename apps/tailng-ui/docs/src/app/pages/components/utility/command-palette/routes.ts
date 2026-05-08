import type { Routes } from '@angular/router';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const commandPaletteItem = group.items.find((item) => item.slug === 'command-palette');
if (commandPaletteItem === undefined) {
  throw new Error('Missing "command-palette" in components utility docs group.');
}

export const COMPONENTS_UTILITY_COMMAND_PALETTE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, commandPaletteItem),
    loadComponent: () =>
      import('./command-palette-page.component').then(
        (module) => module.CommandPalettePageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/command-palette-overview-page.component').then(
            (module) => module.CommandPaletteOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/command-palette-api-page.component').then(
            (module) => module.CommandPaletteApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/command-palette-styling-page.component').then(
            (module) => module.CommandPaletteStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/command-palette-examples-page.component').then(
            (module) => module.CommandPaletteExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
