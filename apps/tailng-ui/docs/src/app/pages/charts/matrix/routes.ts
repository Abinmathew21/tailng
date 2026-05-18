import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('matrix');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts matrix series docs are empty.');
}

const MATRIX_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-matrix': {
    overview: () =>
      import('./basic-matrix/sections/overview/basic-matrix-overview-page.component').then(
        (module) => module.BasicMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./basic-matrix/sections/api/basic-matrix-api-page.component').then(
        (module) => module.BasicMatrixApiPageComponent,
      ),
    styling: () =>
      import('./basic-matrix/sections/styling/basic-matrix-styling-page.component').then(
        (module) => module.BasicMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./basic-matrix/sections/examples/basic-matrix-examples-page.component').then(
        (module) => module.BasicMatrixExamplesPageComponent,
      ),
  },
  'confusion-matrix': {
    overview: () =>
      import('./confusion-matrix/sections/overview/confusion-matrix-overview-page.component').then(
        (module) => module.ConfusionMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./confusion-matrix/sections/api/confusion-matrix-api-page.component').then(
        (module) => module.ConfusionMatrixApiPageComponent,
      ),
    styling: () =>
      import('./confusion-matrix/sections/styling/confusion-matrix-styling-page.component').then(
        (module) => module.ConfusionMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./confusion-matrix/sections/examples/confusion-matrix-examples-page.component').then(
        (module) => module.ConfusionMatrixExamplesPageComponent,
      ),
  },
  'correlation-matrix': {
    overview: () =>
      import('./correlation-matrix/sections/overview/correlation-matrix-overview-page.component').then(
        (module) => module.CorrelationMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./correlation-matrix/sections/api/correlation-matrix-api-page.component').then(
        (module) => module.CorrelationMatrixApiPageComponent,
      ),
    styling: () =>
      import('./correlation-matrix/sections/styling/correlation-matrix-styling-page.component').then(
        (module) => module.CorrelationMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./correlation-matrix/sections/examples/correlation-matrix-examples-page.component').then(
        (module) => module.CorrelationMatrixExamplesPageComponent,
      ),
  },
  'covariance-matrix': {
    overview: () =>
      import('./covariance-matrix/sections/overview/covariance-matrix-overview-page.component').then(
        (module) => module.CovarianceMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./covariance-matrix/sections/api/covariance-matrix-api-page.component').then(
        (module) => module.CovarianceMatrixApiPageComponent,
      ),
    styling: () =>
      import('./covariance-matrix/sections/styling/covariance-matrix-styling-page.component').then(
        (module) => module.CovarianceMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./covariance-matrix/sections/examples/covariance-matrix-examples-page.component').then(
        (module) => module.CovarianceMatrixExamplesPageComponent,
      ),
  },
  'graph-matrix': {
    overview: () =>
      import('./graph-matrix/sections/overview/graph-matrix-overview-page.component').then(
        (module) => module.GraphMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./graph-matrix/sections/api/graph-matrix-api-page.component').then(
        (module) => module.GraphMatrixApiPageComponent,
      ),
    styling: () =>
      import('./graph-matrix/sections/styling/graph-matrix-styling-page.component').then(
        (module) => module.GraphMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./graph-matrix/sections/examples/graph-matrix-examples-page.component').then(
        (module) => module.GraphMatrixExamplesPageComponent,
      ),
  },
  'pie-matrix': {
    overview: () =>
      import('./pie-matrix/sections/overview/pie-matrix-overview-page.component').then(
        (module) => module.PieMatrixOverviewPageComponent,
      ),
    api: () =>
      import('./pie-matrix/sections/api/pie-matrix-api-page.component').then(
        (module) => module.PieMatrixApiPageComponent,
      ),
    styling: () =>
      import('./pie-matrix/sections/styling/pie-matrix-styling-page.component').then(
        (module) => module.PieMatrixStylingPageComponent,
      ),
    examples: () =>
      import('./pie-matrix/sections/examples/pie-matrix-examples-page.component').then(
        (module) => module.PieMatrixExamplesPageComponent,
      ),
  },
  'responsive-matrix-layout': {
    overview: () =>
      import('./responsive-matrix-layout/sections/overview/responsive-matrix-layout-overview-page.component').then(
        (module) => module.ResponsiveMatrixLayoutOverviewPageComponent,
      ),
    api: () =>
      import('./responsive-matrix-layout/sections/api/responsive-matrix-layout-api-page.component').then(
        (module) => module.ResponsiveMatrixLayoutApiPageComponent,
      ),
    styling: () =>
      import('./responsive-matrix-layout/sections/styling/responsive-matrix-layout-styling-page.component').then(
        (module) => module.ResponsiveMatrixLayoutStylingPageComponent,
      ),
    examples: () =>
      import('./responsive-matrix-layout/sections/examples/responsive-matrix-layout-examples-page.component').then(
        (module) => module.ResponsiveMatrixLayoutExamplesPageComponent,
      ),
  },
};

export const CHARTS_MATRIX_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, MATRIX_CHART_SECTION_LOADERS[item.slug]),
  })),
];
