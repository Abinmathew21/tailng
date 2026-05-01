import type { Routes } from '@angular/router';
import { HEADLESS_LAYOUT_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_LAYOUT_GROUP;
const tableItem = group.items.find((item) => item.slug === 'table');
if (tableItem === undefined) {
  throw new Error('Missing "table" in headless layout docs group.');
}

export const HEADLESS_LAYOUT_TABLE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, tableItem),
    loadComponent: () =>
      import('./table-page.component').then((module) => module.HeadlessTablePageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/table-overview-page.component').then(
            (module) => module.HeadlessTableOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/table-api-page.component').then(
            (module) => module.HeadlessTableApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/table-styling-page.component').then(
            (module) => module.HeadlessTableStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/table-examples-page.component').then(
            (module) => module.HeadlessTableExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
