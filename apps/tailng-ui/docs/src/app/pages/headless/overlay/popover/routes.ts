import type { Routes } from '@angular/router';
import { HEADLESS_OVERLAY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_OVERLAY_GROUP;
const popoverItem = group.items.find((item) => item.slug === 'popover');
if (popoverItem === undefined) {
  throw new Error('Missing "popover" in headless overlay docs group.');
}

export const HEADLESS_OVERLAY_POPOVER_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, popoverItem),
    loadComponent: () =>
      import('./popover-page.component').then((module) => module.HeadlessPopoverPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/popover-overview-page.component').then(
            (module) => module.HeadlessPopoverOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/popover-api-page.component').then(
            (module) => module.HeadlessPopoverApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/popover-styling-page.component').then(
            (module) => module.HeadlessPopoverStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/popover-examples-page.component').then(
            (module) => module.HeadlessPopoverExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
