import type { Routes } from '@angular/router';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const codeblockItem = group.items.find((item) => item.slug === 'codeblock');
if (codeblockItem === undefined) {
  throw new Error('Missing "codeblock" in components utility docs group.');
}

export const COMPONENTS_UTILITY_CODEBLOCK_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, codeblockItem),
    loadComponent: () =>
      import('./codeblock-page.component').then((module) => module.CodeblockPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/codeblock-overview-page.component').then(
            (module) => module.CodeblockOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/codeblock-api-page.component').then(
            (module) => module.CodeblockApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/codeblock-styling-page.component').then(
            (module) => module.CodeblockStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/codeblock-examples-page.component').then(
            (module) => module.CodeblockExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'code-block',
          usageCode: [
            '<tng-code-block',
            "  language=\"ts\"",
            "  [code]=\"snippet\"",
            "  title=\"app.config.ts\"",
            '  [copy]="true"',
            '></tng-code-block>',
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
