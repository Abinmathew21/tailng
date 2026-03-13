import type { Routes } from '@angular/router';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const buttonItem = group.items.find((item) => item.slug === 'button');
if (buttonItem === undefined) {
  throw new Error('Missing "button" in components utility docs group.');
}

export const COMPONENTS_UTILITY_BUTTON_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, buttonItem),
    loadComponent: () =>
      import('./button-page.component').then((module) => module.ButtonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/button-overview-page.component').then(
            (module) => module.ButtonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/button-api-page.component').then(
            (module) => module.ButtonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/button-styling-page.component').then(
            (module) => module.ButtonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/button-examples-page.component').then(
            (module) => module.ButtonExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Button',
          componentSymbol: 'TngButtonComponent',
          primitiveSymbol: 'TngPress',
          registrySlug: 'button',
          usageCode: [
            '<tng-button tone="primary" appearance="solid" (click)="onSubmit()">',
            '  Save changes',
            '</tng-button>',
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
