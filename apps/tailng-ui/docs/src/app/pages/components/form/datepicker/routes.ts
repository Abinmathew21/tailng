import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const datepickerItem = group.items.find((item) => item.slug === 'datepicker');
if (datepickerItem === undefined) {
  throw new Error('Missing "datepicker" in components form docs group.');
}

export const COMPONENTS_FORM_DATEPICKER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, datepickerItem),
    loadComponent: () =>
      import('./datepicker-page.component').then((module) => module.DatepickerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/datepicker-overview-page.component').then(
            (module) => module.DatepickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/datepicker-api-page.component').then(
            (module) => module.DatepickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/datepicker-styling-page.component').then(
            (module) => module.DatepickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/datepicker-examples-page.component').then(
            (module) => module.DatepickerExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Datepicker',
          componentSymbol: 'TngDatepickerComponent',
          primitiveSymbol: 'createDatepickerController',
          registrySlug: 'datepicker',
          usageCode: [
            '<tng-datepicker',
            '  [defaultValue]="\'2024-04-22\'"',
            '  [today]="\'2024-04-18\'"',
            '  [minDate]="\'2024-04-01\'"',
            '  [maxDate]="\'2026-03-31\'"',
            '></tng-datepicker>',
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
