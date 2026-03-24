import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const drawerItem = group.items.find((item) => item.slug === 'drawer');
if (drawerItem === undefined) {
  throw new Error('Missing "drawer" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_DRAWER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, drawerItem),
    loadComponent: () =>
      import('./drawer-page.component').then((module) => module.DrawerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/drawer-overview-page.component').then(
            (module) => module.DrawerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/drawer-api-page.component').then(
            (module) => module.DrawerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/drawer-styling-page.component').then(
            (module) => module.DrawerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/drawer-examples-page.component').then(
            (module) => module.DrawerExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'drawer',
          usageCode: [
            '<section tngDrawerContainer>',
            '  <tng-drawer [opened]="open()" (openedChange)="open.set($event)">',
            '    <nav>Side navigation</nav>',
            '  </tng-drawer>',
            '  <main tngDrawerContent>Main content</main>',
            '</section>',
            '',
          ].join('\n'),
        },
        loadComponent: () =>
          import('../../../../shared/ownable-install-section/docs-ownable-install-section.component')
            .then((module) => module.DocsOwnableInstallSectionComponent),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
