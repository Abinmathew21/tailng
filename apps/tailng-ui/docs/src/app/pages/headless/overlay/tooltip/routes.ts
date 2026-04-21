import type { Routes } from '@angular/router';
import { HEADLESS_OVERLAY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_OVERLAY_GROUP;
const tooltipItem = group.items.find((item) => item.slug === 'tooltip');
if (tooltipItem === undefined) {
  throw new Error('Missing "tooltip" in headless overlay docs group.');
}

export const HEADLESS_OVERLAY_TOOLTIP_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, tooltipItem),
    loadComponent: () =>
      import('./tooltip-page.component').then((module) => module.HeadlessTooltipPageComponent),
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
            (module) => module.HeadlessTooltipOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tooltip-api-page.component').then(
            (module) => module.HeadlessTooltipApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tooltip-styling-page.component').then(
            (module) => module.HeadlessTooltipStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tooltip-examples-page.component').then(
            (module) => module.HeadlessTooltipExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
