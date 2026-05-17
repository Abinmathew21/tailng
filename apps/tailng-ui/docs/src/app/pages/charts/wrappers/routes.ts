import type { Routes } from '@angular/router';
import { CHARTS_WRAPPERS_GROUP, toChartsDocsRouteData } from '../chart-docs.data';

const group = CHARTS_WRAPPERS_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts wrappers docs are empty.');
}

function wrapperRoutes(itemSlug: string): Routes {
  const item = group.items.find((candidate) => candidate.slug === itemSlug);
  if (!item) {
    throw new Error(`Missing "${itemSlug}" in charts wrappers docs group.`);
  }

  return [
    {
      path: '',
      data: toChartsDocsRouteData(group, item),
      loadComponent: () =>
        import('./shared/chart-wrapper-page.component').then(
          (module) => module.ChartWrapperPageComponent,
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
            import('./shared/sections/chart-wrapper-overview-page.component').then(
              (module) => module.ChartWrapperOverviewPageComponent,
            ),
        },
        {
          path: 'api',
          loadComponent: () =>
            import('./shared/sections/chart-wrapper-api-page.component').then(
              (module) => module.ChartWrapperApiPageComponent,
            ),
        },
        {
          path: 'styling',
          loadComponent: () =>
            import('./shared/sections/chart-wrapper-styling-page.component').then(
              (module) => module.ChartWrapperStylingPageComponent,
            ),
        },
        {
          path: 'examples',
          loadComponent: () =>
            import('./shared/sections/chart-wrapper-examples-page.component').then(
              (module) => module.ChartWrapperExamplesPageComponent,
            ),
        },
        {
          path: '**',
          redirectTo: 'overview',
        },
      ],
    },
  ];
}

export const CHARTS_WRAPPERS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.flatMap((item) => [
    {
      path: item.slug,
      children: wrapperRoutes(item.slug),
    },
  ]),
];
