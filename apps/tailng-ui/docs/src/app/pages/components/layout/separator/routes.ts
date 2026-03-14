import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const separatorItem = group.items.find((item) => item.slug === 'separator');
if (separatorItem === undefined) {
  throw new Error('Missing "separator" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_SEPARATOR_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, separatorItem),
    loadComponent: () =>
      import('./separator-page.component').then((module) => module.SeparatorPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/separator-overview-page.component').then(
            (module) => module.SeparatorOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/separator-api-page.component').then(
            (module) => module.SeparatorApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/separator-styling-page.component').then(
            (module) => module.SeparatorStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/separator-examples-page.component').then(
            (module) => module.SeparatorExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Separator',
          componentSymbol: 'TngSeparatorComponent',
          primitiveSymbol: 'TngSeparator',
          registrySlug: 'separator',
          usageCode: [
            '<section class="stack">',
            '  <h3>Account</h3>',
            '  <tng-separator></tng-separator>',
            '  <p>Connected projects</p>',
            '</section>',
            '',
            '<div class="toolbar">',
            '  <button type="button">Grid</button>',
            '  <tng-separator orientation="vertical"></tng-separator>',
            '  <button type="button">List</button>',
            '</div>',
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
