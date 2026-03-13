import type { Routes } from '@angular/router';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const menuItem = group.items.find((item) => item.slug === 'menu');
if (menuItem === undefined) {
  throw new Error('Missing "menu" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_MENU_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, menuItem),
    loadComponent: () =>
      import('./menu-page.component').then((module) => module.MenuPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/menu-overview-page.component').then(
            (module) => module.MenuOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/menu-api-page.component').then(
            (module) => module.MenuApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/menu-styling-page.component').then(
            (module) => module.MenuStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/menu-examples-page.component').then(
            (module) => module.MenuExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Menu',
          componentSymbol: 'TngMenuComponent',
          primitiveSymbol: 'TngMenu',
          registrySlug: 'menu',
          usageCode: [
            '<button type="button" [tngMenuTriggerFor]="actionsMenu">Actions</button>',
            '<tng-menu #actionsMenu="tngMenu" ariaLabel="Actions menu">',
            '  <button type="button" tngMenuItem tngMenuItemValue="Duplicate">Duplicate</button>',
            '  <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
            '</tng-menu>',
            '',
          ].join('\n'),
        },
        loadComponent: () =>
          import('../../../../shared/ownable-install-section/docs-ownable-install-section.component').then(
            (module) => module.DocsOwnableInstallSectionComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
