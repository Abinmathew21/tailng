import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('boxplot');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts boxplot series docs are empty.');
}

const BOXPLOT_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'aggregated-boxplot': {
    overview: () =>
      import('./aggregated-boxplot/sections/overview/aggregated-boxplot-overview-page.component').then(
        (module) => module.AggregatedBoxplotOverviewPageComponent,
      ),
    api: () =>
      import('./aggregated-boxplot/sections/api/aggregated-boxplot-api-page.component').then(
        (module) => module.AggregatedBoxplotApiPageComponent,
      ),
    styling: () =>
      import('./aggregated-boxplot/sections/styling/aggregated-boxplot-styling-page.component').then(
        (module) => module.AggregatedBoxplotStylingPageComponent,
      ),
    examples: () =>
      import('./aggregated-boxplot/sections/examples/aggregated-boxplot-examples-page.component').then(
        (module) => module.AggregatedBoxplotExamplesPageComponent,
      ),
  },
  'basic-boxplot': {
    overview: () =>
      import('./basic-boxplot/sections/overview/basic-boxplot-overview-page.component').then(
        (module) => module.BasicBoxplotOverviewPageComponent,
      ),
    api: () =>
      import('./basic-boxplot/sections/api/basic-boxplot-api-page.component').then(
        (module) => module.BasicBoxplotApiPageComponent,
      ),
    styling: () =>
      import('./basic-boxplot/sections/styling/basic-boxplot-styling-page.component').then(
        (module) => module.BasicBoxplotStylingPageComponent,
      ),
    examples: () =>
      import('./basic-boxplot/sections/examples/basic-boxplot-examples-page.component').then(
        (module) => module.BasicBoxplotExamplesPageComponent,
      ),
  },
  'multi-category-boxplot': {
    overview: () =>
      import('./multi-category-boxplot/sections/overview/multi-category-boxplot-overview-page.component').then(
        (module) => module.MultiCategoryBoxplotOverviewPageComponent,
      ),
    api: () =>
      import('./multi-category-boxplot/sections/api/multi-category-boxplot-api-page.component').then(
        (module) => module.MultiCategoryBoxplotApiPageComponent,
      ),
    styling: () =>
      import('./multi-category-boxplot/sections/styling/multi-category-boxplot-styling-page.component').then(
        (module) => module.MultiCategoryBoxplotStylingPageComponent,
      ),
    examples: () =>
      import('./multi-category-boxplot/sections/examples/multi-category-boxplot-examples-page.component').then(
        (module) => module.MultiCategoryBoxplotExamplesPageComponent,
      ),
  },
};

export const CHARTS_BOXPLOT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, BOXPLOT_CHART_SECTION_LOADERS[item.slug]),
  })),
];
