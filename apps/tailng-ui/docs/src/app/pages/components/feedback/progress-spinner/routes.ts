import type { Routes } from '@angular/router';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const progressSpinnerItem = group.items.find((item) => item.slug === 'progress-spinner');
if (progressSpinnerItem === undefined) {
  throw new Error('Missing "progress-spinner" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_PROGRESS_SPINNER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, progressSpinnerItem),
    loadComponent: () =>
      import('./progress-spinner-page.component').then((module) => module.ProgressSpinnerPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/progress-spinner-overview-page.component').then(
            (module) => module.ProgressSpinnerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/progress-spinner-api-page.component').then(
            (module) => module.ProgressSpinnerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/progress-spinner-styling-page.component').then(
            (module) => module.ProgressSpinnerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/progress-spinner-examples-page.component').then(
            (module) => module.ProgressSpinnerExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Progress Spinner',
          componentSymbol: 'TngProgressSpinnerComponent',
          primitiveSymbol: 'TngProgressSpinner',
          registrySlug: 'progress-spinner',
          usageCode: [
            '<tng-progress-spinner',
            '  [min]="0"',
            '  [max]="100"',
            '  [value]="72"',
            '  ariaLabel="Sync progress"',
            '></tng-progress-spinner>',
            '',
            '<tng-progress-spinner',
            '  [indeterminate]="true"',
            '  ariaLabel="Loading"',
            '></tng-progress-spinner>',
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
