import type { Routes } from '@angular/router';
import { COMPONENTS_OVERLAY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_OVERLAY_GROUP;
const tooltipItem = group.items.find((item) => item.slug === 'tooltip');
if (tooltipItem === undefined) {
  throw new Error('Missing "tooltip" in components overlay docs group.');
}

export const COMPONENTS_OVERLAY_TOOLTIP_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, tooltipItem),
    loadComponent: () =>
      import('./tooltip-page.component').then((module) => module.TooltipPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tooltip-overview-page.component').then(
            (module) => module.TooltipOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tooltip-api-page.component').then(
            (module) => module.TooltipApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tooltip-styling-page.component').then(
            (module) => module.TooltipStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tooltip-examples-page.component').then(
            (module) => module.TooltipExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'tooltip',
          usageCode: [
            '<tng-tooltip triggerLabel="Hover for hint" text="Short helper text"></tng-tooltip>',
            '',
            '<!-- or project custom content -->',
            '<tng-tooltip triggerLabel="Hover for hint">',
            '  <span>Short helper text</span>',
            '</tng-tooltip>',
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
