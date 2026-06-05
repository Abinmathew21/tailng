import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const fileuploadItem = group.items.find((item) => item.slug === 'fileupload');
if (fileuploadItem === undefined) {
  throw new Error('Missing "fileupload" in components form docs group.');
}

export const COMPONENTS_FORM_FILEUPLOAD_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, fileuploadItem),
    loadComponent: () =>
      import('./fileupload-page.component').then((module) => module.FileUploadPageComponent),
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
            (module) => module.FileUploadOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/fileupload-api-page.component').then(
            (module) => module.FileUploadApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/fileupload-styling-page.component').then(
            (module) => module.FileUploadStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/fileupload-examples-page.component').then(
            (module) => module.FileUploadExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
