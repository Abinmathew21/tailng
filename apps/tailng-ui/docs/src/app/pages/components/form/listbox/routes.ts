import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const listboxItem = group.items.find((item) => item.slug === 'listbox');
if (listboxItem === undefined) {
  throw new Error('Missing "listbox" in components form docs group.');
}

export const COMPONENTS_FORM_LISTBOX_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, listboxItem),
    loadComponent: () =>
      import('./listbox-page.component').then((module) => module.ListboxPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/listbox-overview-page.component').then(
            (module) => module.ListboxOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/listbox-api-page.component').then(
            (module) => module.ListboxApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/listbox-styling-page.component').then(
            (module) => module.ListboxStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/listbox-examples-page.component').then(
            (module) => module.ListboxExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'ListBox',
          componentSymbol: 'TngListbox',
          primitiveSymbol: 'TngListboxDirective',
          registrySlug: 'listbox',
          usageCode: [
            '<div',
            '  tngListbox',
            '  tabindex="0"',
            '  [multiple]="true"',
            '  [value]="selectedValues"',
            '  (valueChange)="selectedValues = toArray($event)"',
            '>',
            '  @for (option of options; track option.id) {',
            '    <div tngOption [tngValue]="option.id">{{ option.label }}</div>',
            '  }',
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
