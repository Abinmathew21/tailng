import type { Routes } from '@angular/router';
import { CHARTS_SERIES_DOCS_GROUPS } from './chart-series-docs.data';
import { buildChartSeriesItemRoutes } from './shared/chart-series-item.routes';

function resolveGroupIndex(groupId: string): number {
  const groupIndex = CHARTS_SERIES_DOCS_GROUPS.findIndex((group) => group.id === groupId);
  if (groupIndex === -1) {
    throw new Error(`Unknown charts series docs group "${groupId}".`);
  }

  return groupIndex;
}

export function buildChartSeriesCategoryRoutes(groupId: string): Routes {
  const groupIndex = resolveGroupIndex(groupId);
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
    ...group.items.map((item) => ({
      path: item.slug,
      children: buildChartSeriesItemRoutes(group, item),
    })),
  ];
}
