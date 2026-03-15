import type { Routes } from '@angular/router';
import { COMPONENTS_OVERLAY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_OVERLAY_GROUP;
const dialogItem = group.items.find((item) => item.slug === 'dialog');
if (dialogItem === undefined) {
  throw new Error('Missing "dialog" in components overlay docs group.');
}

export const COMPONENTS_OVERLAY_DIALOG_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, dialogItem),
    loadComponent: () =>
      import('./dialog-page.component').then((module) => module.DialogPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/dialog-overview-page.component').then(
            (module) => module.DialogOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/dialog-api-page.component').then(
            (module) => module.DialogApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/dialog-styling-page.component').then(
            (module) => module.DialogStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/dialog-examples-page.component').then(
            (module) => module.DialogExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          componentName: 'Dialog',
          componentSymbol: 'TngDialogComponent',
          primitiveSymbol: 'TngDialog',
          registrySlug: 'dialog',
          usageCode: [
            '<button type="button" [tngDialogTriggerFor]="reviewDialog">Open</button>',
            '<tng-dialog #reviewDialog="tngDialog" title="Review">',
            '  <p>Dialog body content</p>',
            '</tng-dialog>',
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
