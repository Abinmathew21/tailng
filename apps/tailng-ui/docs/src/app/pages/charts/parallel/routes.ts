import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('parallel');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts parallel series docs are empty.');
}

const PARALLEL_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'aqi-parallel': {
    overview: () =>
      import('./aqi-parallel/sections/overview/aqi-parallel-overview-page.component').then(
        (module) => module.AqiParallelOverviewPageComponent,
      ),
    api: () =>
      import('./aqi-parallel/sections/api/aqi-parallel-api-page.component').then(
        (module) => module.AqiParallelApiPageComponent,
      ),
    styling: () =>
      import('./aqi-parallel/sections/styling/aqi-parallel-styling-page.component').then(
        (module) => module.AqiParallelStylingPageComponent,
      ),
    examples: () =>
      import('./aqi-parallel/sections/examples/aqi-parallel-examples-page.component').then(
        (module) => module.AqiParallelExamplesPageComponent,
      ),
  },
  'basic-parallel': {
    overview: () =>
      import('./basic-parallel/sections/overview/basic-parallel-overview-page.component').then(
        (module) => module.BasicParallelOverviewPageComponent,
      ),
    api: () =>
      import('./basic-parallel/sections/api/basic-parallel-api-page.component').then(
        (module) => module.BasicParallelApiPageComponent,
      ),
    styling: () =>
      import('./basic-parallel/sections/styling/basic-parallel-styling-page.component').then(
        (module) => module.BasicParallelStylingPageComponent,
      ),
    examples: () =>
      import('./basic-parallel/sections/examples/basic-parallel-examples-page.component').then(
        (module) => module.BasicParallelExamplesPageComponent,
      ),
  },
  'nutrients-parallel': {
    overview: () =>
      import('./nutrients-parallel/sections/overview/nutrients-parallel-overview-page.component').then(
        (module) => module.NutrientsParallelOverviewPageComponent,
      ),
    api: () =>
      import('./nutrients-parallel/sections/api/nutrients-parallel-api-page.component').then(
        (module) => module.NutrientsParallelApiPageComponent,
      ),
    styling: () =>
      import('./nutrients-parallel/sections/styling/nutrients-parallel-styling-page.component').then(
        (module) => module.NutrientsParallelStylingPageComponent,
      ),
    examples: () =>
      import('./nutrients-parallel/sections/examples/nutrients-parallel-examples-page.component').then(
        (module) => module.NutrientsParallelExamplesPageComponent,
      ),
  },
};

export const CHARTS_PARALLEL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, PARALLEL_CHART_SECTION_LOADERS[item.slug]),
  })),
];
