import type { Routes } from '@angular/router';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const emptyItem = group.items.find((item) => item.slug === 'empty');
if (emptyItem === undefined) {
  throw new Error('Missing "empty" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_EMPTY_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, emptyItem),
    loadComponent: () =>
      import('./empty-page.component').then((module) => module.EmptyPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/empty-overview-page.component').then(
            (module) => module.EmptyOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/empty-api-page.component').then(
            (module) => module.EmptyApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/empty-styling-page.component').then(
            (module) => module.EmptyStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/empty-examples-page.component').then(
            (module) => module.EmptyExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Empty',
          componentSymbol: 'TngEmptyComponent',
          primitiveSymbol: 'TngEmpty',
          registrySlug: 'empty',
          usageCode: [
            '<tng-empty>',
            '  <tng-empty-icon>📭</tng-empty-icon>',
            '  <tng-empty-title>No messages</tng-empty-title>',
            '  <tng-empty-description>',
            '    You are all caught up. Invite your team to start new conversations.',
            '  </tng-empty-description>',
            '  <tng-empty-actions>',
            '    <button type="button">Invite team</button>',
            '  </tng-empty-actions>',
            '</tng-empty>',
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
