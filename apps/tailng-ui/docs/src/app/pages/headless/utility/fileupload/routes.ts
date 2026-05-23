import type { Routes } from '@angular/router';
import { HEADLESS_UTILITY_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_UTILITY_GROUP;
const fileuploadItem = group.items.find((item) => item.slug === 'fileupload');
if (fileuploadItem === undefined) {
  throw new Error('Missing "fileupload" in headless utility docs group.');
}

export const HEADLESS_UTILITY_FILEUPLOAD_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, fileuploadItem),
    loadComponent: () =>
      import('./fileupload-page.component').then(
        (module) => module.HeadlessFileuploadPageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/fileupload-overview-page.component').then(
            (module) => module.HeadlessFileuploadOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/fileupload-api-page.component').then(
            (module) => module.HeadlessFileuploadApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/fileupload-styling-page.component').then(
            (module) => module.HeadlessFileuploadStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/fileupload-examples-page.component').then(
            (module) => module.HeadlessFileuploadExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
