import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const cardItem = group.items.find((item) => item.slug === 'card');
if (cardItem === undefined) {
  throw new Error('Missing "card" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_CARD_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, cardItem),
    loadComponent: () =>
      import('./card-page.component').then((module) => module.CardPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/card-overview-page.component').then(
            (module) => module.CardOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/card-api-page.component').then(
            (module) => module.CardApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/card-styling-page.component').then(
            (module) => module.CardStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/card-examples-page.component').then(
            (module) => module.CardExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Card',
          componentSymbol: 'TngCardComponent',
          primitiveSymbol: 'TngCard',
          registrySlug: 'card',
          usageCode: [
            '<tng-card>',
            '  <tng-card-header>',
            '    <tng-card-title>Release notes</tng-card-title>',
            '    <tng-card-description>Track rollout status and follow-up actions.</tng-card-description>',
            '  </tng-card-header>',
            '  <tng-card-content>',
            '    <p>Build artifacts are ready for production promotion.</p>',
            '  </tng-card-content>',
            '  <tng-card-footer>',
            '    <button type="button">View details</button>',
            '  </tng-card-footer>',
            '</tng-card>',
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
