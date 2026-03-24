import type { Routes } from '@angular/router';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const contextMenuItem = group.items.find((item) => item.slug === 'context-menu');
if (contextMenuItem === undefined) {
  throw new Error('Missing "context-menu" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_CONTEXT_MENU_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, contextMenuItem),
    loadComponent: () =>
      import('./context-menu-page.component').then((module) => module.ContextMenuPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/context-menu-overview-page.component').then(
            (module) => module.ContextMenuOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/context-menu-api-page.component').then(
            (module) => module.ContextMenuApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/context-menu-styling-page.component').then(
            (module) => module.ContextMenuStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/context-menu-examples-page.component').then(
            (module) => module.ContextMenuExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'context-menu',
          usageCode: [
            '<div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
            '<tng-context-menu #assetMenu="tngContextMenu" ariaLabel="Asset actions">',
            '  <button type="button" tngMenuItem tngMenuItemValue="Rename">Rename</button>',
            '  <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
            '</tng-context-menu>',
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
