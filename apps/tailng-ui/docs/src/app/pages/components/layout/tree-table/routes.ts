import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const treeTableItem = group.items.find((item) => item.slug === 'tree-table');
if (treeTableItem === undefined) {
  throw new Error('Missing "tree-table" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_TREE_TABLE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, treeTableItem),
    loadComponent: () =>
      import('./tree-table-page.component').then((module) => module.TreeTablePageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tree-table-overview-page.component').then(
            (module) => module.TreeTableOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tree-table-api-page.component').then(
            (module) => module.TreeTableApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tree-table-styling-page.component').then(
            (module) => module.TreeTableStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tree-table-examples-page.component').then(
            (module) => module.TreeTableExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
