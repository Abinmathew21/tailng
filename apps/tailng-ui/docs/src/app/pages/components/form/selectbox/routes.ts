import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'selectbox');
if (item === undefined) {
  throw new Error('Missing "selectbox" in components form docs group.');
}

export const COMPONENTS_FORM_SELECTBOX_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./selectbox-page.component').then((module) => module.SelectboxPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/selectbox-overview-page.component').then(
            (module) => module.SelectboxOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/selectbox-api-page.component').then(
            (module) => module.SelectboxApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/selectbox-styling-page.component').then(
            (module) => module.SelectboxStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/selectbox-examples-page.component').then(
            (module) => module.SelectboxExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'SelectBox',
          componentSymbol: 'TngSelectComponent',
          primitiveSymbol: 'TngSelect',
          registrySlug: 'selectbox',
          usageCode: [
            '<tng-select',
            '  [options]="planets"',
            '  [value]="selectedPlanet"',
            '  (valueChange)="selectedPlanet = toSingleValue($event)"',
            '  [getOptionValue]="getPlanetValue"',
            '  [getOptionLabel]="getPlanetLabel"',
            '  placeholder="Select planet"',
            '></tng-select>',
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
