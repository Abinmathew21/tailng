import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';
import type { ChartsDocsGroup, ChartsDocsItem } from '../../chart-docs.data';
import { toChartsDocsRouteData } from '../../chart-docs.data';

export type ChartSeriesSectionLoader = () => Promise<Type<unknown>>;

export type ChartSeriesSectionLoaders = Readonly<{
  overview: ChartSeriesSectionLoader;
  api: ChartSeriesSectionLoader;
  styling: ChartSeriesSectionLoader;
  examples: ChartSeriesSectionLoader;
}>;

function buildChartSeriesLocalSectionRoutes(loaders: ChartSeriesSectionLoaders): Routes {
  return [
    {
      path: 'overview',
      loadComponent: loaders.overview,
    },
    {
      path: 'api',
      loadComponent: loaders.api,
    },
    {
      path: 'styling',
      loadComponent: loaders.styling,
    },
    {
      path: 'examples',
      loadComponent: loaders.examples,
    },
  ];
}

export function buildChartSeriesLocalItemRoutes(
  group: ChartsDocsGroup,
  item: ChartsDocsItem,
  loaders: ChartSeriesSectionLoaders | undefined,
): Routes {
  if (loaders === undefined) {
    throw new Error(`Missing chart docs section loaders for "${group.id}/${item.slug}".`);
  }

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
        ...buildChartSeriesLocalSectionRoutes(loaders),
        {
          path: '**',
          redirectTo: 'overview',
        },
      ],
    },
  ];
}
