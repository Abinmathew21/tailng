import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'chips');
if (item === undefined) {
  throw new Error('Missing "chips" in components form docs group.');
}

export const COMPONENTS_FORM_CHIPS_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () => import('./chips-page.component').then((module) => module.ChipsPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/chips-overview-page.component').then(
            (module) => module.ChipsOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/chips-api-page.component').then(
            (module) => module.ChipsApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/chips-styling-page.component').then(
            (module) => module.ChipsStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/chips-examples-page.component').then(
            (module) => module.ChipsExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Chips',
          componentSymbol: 'TngChipsComponent',
          primitiveSymbol: 'TngChips',
          registrySlug: 'chips',
          usageCode: [
            '<tng-chips [values]="selectedTags" (valuesChange)="selectedTags = $event">',
            '  @for (tag of selectedTags; track tag) {',
            '    <span tngChip [tngChipValue]="tag" [tngChipLabel]="tag">',
            '      <span>{{ tag }}</span>',
            '      <button tngChipRemove type="button"></button>',
            '    </span>',
            '  }',
            '</tng-chips>',
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
