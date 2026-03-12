import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'multiselect');
if (item === undefined) {
  throw new Error('Missing "multiselect" in components form docs group.');
}

export const COMPONENTS_FORM_MULTISELECT_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./multiselect-page.component').then((module) => module.MultiselectPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/multiselect-overview-page.component').then(
            (module) => module.MultiselectOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/multiselect-api-page.component').then(
            (module) => module.MultiselectApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/multiselect-styling-page.component').then(
            (module) => module.MultiselectStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/multiselect-examples-page.component').then(
            (module) => module.MultiselectExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'MultiSelect',
          componentSymbol: 'TngMultiSelectComponent',
          primitiveSymbol: 'TngMultiSelect',
          registrySlug: 'multiselect',
          usageCode: [
            '<tng-multiselect',
            '  [options]="planets"',
            '  [value]="selectedPlanets"',
            '  (valueChange)="selectedPlanets = toValueArray($event)"',
            '  [getOptionValue]="getPlanetValue"',
            '  [getOptionLabel]="getPlanetLabel"',
            '  placeholder="Select planets"',
            '></tng-multiselect>',
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
