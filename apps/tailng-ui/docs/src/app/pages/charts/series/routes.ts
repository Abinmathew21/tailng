import type { Routes } from '@angular/router';
import { toChartsDocsRouteData } from '../chart-docs.data';
import { CHARTS_SERIES_DOCS_GROUPS } from './chart-series-docs.data';

function buildChartSeriesItemRoutes(groupIndex: number, itemIndex: number): Routes {
  const group = CHARTS_SERIES_DOCS_GROUPS[groupIndex];
  if (group === undefined) {
    throw new Error('Missing charts series docs group.');
  }

  const item = group.items[itemIndex];
  if (item === undefined) {
    throw new Error(`Missing charts series docs item for ${group.id}.`);
  }

  return [
    {
      path: '',
      data: toChartsDocsRouteData(group, item),
      loadComponent: () =>
        import('./shared/chart-series-page.component').then(
          (module) => module.ChartSeriesPageComponent,
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
            import('./sections/overview/chart-series-overview-page.component').then(
              (module) => module.ChartSeriesOverviewPageComponent,
            ),
        },
        {
          path: 'api',
          loadComponent: () =>
            import('./sections/api/chart-series-api-page.component').then(
              (module) => module.ChartSeriesApiPageComponent,
            ),
        },
        {
          path: 'styling',
          loadComponent: () =>
            import('./sections/styling/chart-series-styling-page.component').then(
              (module) => module.ChartSeriesStylingPageComponent,
            ),
        },
        {
          path: 'examples',
          loadComponent: () =>
            import('./sections/examples/chart-series-examples-page.component').then(
              (module) => module.ChartSeriesExamplesPageComponent,
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

function buildChartSeriesCategoryRoutes(groupIndex: number): Routes {
  const group = CHARTS_SERIES_DOCS_GROUPS[groupIndex];
  if (group === undefined) {
    throw new Error('Missing charts series docs group.');
  }

  const defaultItem = group.items[0];
  if (defaultItem === undefined) {
    throw new Error(`Charts series docs group "${group.id}" is empty.`);
  }

  return [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: defaultItem.slug,
    },
    ...group.items.map((item, itemIndex) => ({
      path: item.slug,
      children: buildChartSeriesItemRoutes(groupIndex, itemIndex),
    })),
  ];
}

export const CHARTS_SERIES_ROUTES: Routes = CHARTS_SERIES_DOCS_GROUPS.map((group, groupIndex) => ({
  path: group.id,
  children: buildChartSeriesCategoryRoutes(groupIndex),
}));
