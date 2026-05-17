import type { Routes } from '@angular/router';
import type { ChartsDocsGroup, ChartsDocsItem } from '../../chart-docs.data';
import { toChartsDocsRouteData } from '../../chart-docs.data';
import { buildChartSeriesPilotChildRoutes } from '../pilot/chart-series-pilot.registry';

export function buildChartSeriesItemRoutes(
  group: ChartsDocsGroup,
  item: ChartsDocsItem,
): Routes {
  return [
    {
      path: '',
      data: toChartsDocsRouteData(group, item),
      loadComponent: () =>
        import('./chart-series-page.component').then(
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
