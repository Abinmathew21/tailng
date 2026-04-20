import type { Routes } from '@angular/router';
import { HEADLESS_NAVIGATION_GROUP, toHeadlessDocsRouteData } from '../../headless-docs.data';

const group = HEADLESS_NAVIGATION_GROUP;
const treeItem = group.items.find((item) => item.slug === 'tree');
if (treeItem === undefined) {
  throw new Error('Missing "tree" in headless navigation docs group.');
}

export const HEADLESS_NAVIGATION_TREE_ROUTES: Routes = [
  {
    path: '',
    data: toHeadlessDocsRouteData(group, treeItem),
    loadComponent: () => import('./tree-page.component').then((module) => module.HeadlessTreePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tree-overview-page.component').then(
            (module) => module.HeadlessTreeOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tree-api-page.component').then(
            (module) => module.HeadlessTreeApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tree-styling-page.component').then(
            (module) => module.HeadlessTreeStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tree-examples-page.component').then(
            (module) => module.HeadlessTreeExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
