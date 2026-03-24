import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'label');
if (item === undefined) {
  throw new Error('Missing "label" in components form docs group.');
}

export const COMPONENTS_FORM_LABEL_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () => import('./label-page.component').then((module) => module.LabelPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/label-overview-page.component').then(
            (module) => module.LabelOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/label-api-page.component').then(
            (module) => module.LabelApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/label-styling-page.component').then(
            (module) => module.LabelStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/label-examples-page.component').then(
            (module) => module.LabelExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'label',
          usageCode: [
            '<tng-label forId="email" [required]="true">Email address</tng-label>',
            '<input id="email" tngInput type="email" aria-required="true" />',
            '',
            '<label tngLabel for="terms">Accept terms</label>',
            '<input id="terms" tngCheckbox type="checkbox" />',
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
