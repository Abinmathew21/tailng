import type { Routes } from '@angular/router';
import { HEADLESS_OVERLAY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_OVERLAY_GROUP;
const dialogItem = group.items.find((item) => item.slug === 'dialog');
if (dialogItem === undefined) {
  throw new Error('Missing "dialog" in headless overlay docs group.');
}

export const HEADLESS_OVERLAY_DIALOG_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, dialogItem),
    loadComponent: () =>
      import('./dialog-page.component').then((module) => module.HeadlessDialogPageComponent),
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
            (module) => module.HeadlessDialogOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/dialog-api-page.component').then(
            (module) => module.HeadlessDialogApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/dialog-styling-page.component').then(
            (module) => module.HeadlessDialogStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/dialog-examples-page.component').then(
            (module) => module.HeadlessDialogExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
