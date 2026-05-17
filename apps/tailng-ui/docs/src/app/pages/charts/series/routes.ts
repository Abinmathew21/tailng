import type { Routes } from '@angular/router';
import { toChartsDocsRouteData } from '../chart-docs.data';
import { CHARTS_SERIES_DOCS_GROUPS } from './chart-series-docs.data';
import { buildChartSeriesPilotChildRoutes } from './pilot/chart-series-pilot.registry';

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
        ...buildChartSeriesPilotChildRoutes(group.id, item.slug),
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
