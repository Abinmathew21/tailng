import type { Routes } from '@angular/router';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const skeletonItem = group.items.find((item) => item.slug === 'skeleton');
if (skeletonItem === undefined) {
  throw new Error('Missing "skeleton" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_SKELETON_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, skeletonItem),
    loadComponent: () => import('./skeleton-page.component').then((module) => module.SkeletonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/skeleton-overview-page.component').then(
            (module) => module.SkeletonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/skeleton-api-page.component').then(
            (module) => module.SkeletonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/skeleton-styling-page.component').then(
            (module) => module.SkeletonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/skeleton-examples-page.component').then(
            (module) => module.SkeletonExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'skeleton',
          usageCode: [
            '<tng-skeleton width="75%" height="1rem"></tng-skeleton>',
            '<tng-skeleton width="40%" height="1rem"></tng-skeleton>',
            '<tng-skeleton width="100%" height="7rem" [rounded]="false"></tng-skeleton>',
            '',
          ].join('\n'),
        },
        loadComponent: () =>
          import('../../../../shared/ownable-install-section/docs-ownable-install-section.component')
            .then((module) => module.DocsOwnableInstallSectionComponent),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
