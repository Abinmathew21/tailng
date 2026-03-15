import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const radioItem = group.items.find((item) => item.slug === 'radio');
if (radioItem === undefined) {
  throw new Error('Missing "radio" in components form docs group.');
}

export const COMPONENTS_FORM_RADIO_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, radioItem),
    loadComponent: () => import('./radio-page.component').then((module) => module.RadioPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/radio-overview-page.component').then(
            (module) => module.RadioOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/radio-api-page.component').then(
            (module) => module.RadioApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/radio-styling-page.component').then(
            (module) => module.RadioStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/radio-examples-page.component').then(
            (module) => module.RadioExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Radio',
          componentSymbol: 'TngRadioComponent',
          primitiveSymbol: 'TngRadio',
          registrySlug: 'radio',
          usageCode: [
            '<tng-radio',
            '  name="plan"',
            '  value="pro"',
            '  [checked]="plan === \'pro\'"',
            '  (checkedChange)="plan = $event ? \'pro\' : plan"',
            '>',
            '  Pro plan',
            '</tng-radio>',
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
