import type { Routes } from '@angular/router';
import { HEADLESS_FORM_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_FORM_GROUP;
const listboxItem = group.items.find((item) => item.slug === 'listbox');
if (listboxItem === undefined) {
  throw new Error('Missing "listbox" in headless form docs group.');
}

export const HEADLESS_FORM_LISTBOX_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, listboxItem),
    loadComponent: () =>
      import('./listbox-page.component').then((module) => module.HeadlessListboxPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/listbox-overview-page.component').then(
            (module) => module.HeadlessListboxOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/listbox-api-page.component').then(
            (module) => module.HeadlessListboxApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/listbox-styling-page.component').then(
            (module) => module.HeadlessListboxStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/listbox-examples-page.component').then(
            (module) => module.HeadlessListboxExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
