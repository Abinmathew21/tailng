import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('tree');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts tree series docs are empty.');
}

const TREE_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-tree': {
    overview: () =>
      import('./basic-tree/sections/overview/basic-tree-overview-page.component').then(
        (module) => module.BasicTreeOverviewPageComponent,
      ),
    api: () =>
      import('./basic-tree/sections/api/basic-tree-api-page.component').then(
        (module) => module.BasicTreeApiPageComponent,
      ),
    styling: () =>
      import('./basic-tree/sections/styling/basic-tree-styling-page.component').then(
        (module) => module.BasicTreeStylingPageComponent,
      ),
    examples: () =>
      import('./basic-tree/sections/examples/basic-tree-examples-page.component').then(
        (module) => module.BasicTreeExamplesPageComponent,
      ),
  },
  'horizontal-tree': {
    overview: () =>
      import('./horizontal-tree/sections/overview/horizontal-tree-overview-page.component').then(
        (module) => module.HorizontalTreeOverviewPageComponent,
      ),
    api: () =>
      import('./horizontal-tree/sections/api/horizontal-tree-api-page.component').then(
        (module) => module.HorizontalTreeApiPageComponent,
      ),
    styling: () =>
      import('./horizontal-tree/sections/styling/horizontal-tree-styling-page.component').then(
        (module) => module.HorizontalTreeStylingPageComponent,
      ),
    examples: () =>
      import('./horizontal-tree/sections/examples/horizontal-tree-examples-page.component').then(
        (module) => module.HorizontalTreeExamplesPageComponent,
      ),
  },
  'polyline-tree': {
    overview: () =>
      import('./polyline-tree/sections/overview/polyline-tree-overview-page.component').then(
        (module) => module.PolylineTreeOverviewPageComponent,
      ),
    api: () =>
      import('./polyline-tree/sections/api/polyline-tree-api-page.component').then(
        (module) => module.PolylineTreeApiPageComponent,
      ),
    styling: () =>
      import('./polyline-tree/sections/styling/polyline-tree-styling-page.component').then(
        (module) => module.PolylineTreeStylingPageComponent,
      ),
    examples: () =>
      import('./polyline-tree/sections/examples/polyline-tree-examples-page.component').then(
        (module) => module.PolylineTreeExamplesPageComponent,
      ),
  },
  'radial-tree': {
    overview: () =>
      import('./radial-tree/sections/overview/radial-tree-overview-page.component').then(
        (module) => module.RadialTreeOverviewPageComponent,
      ),
    api: () =>
      import('./radial-tree/sections/api/radial-tree-api-page.component').then(
        (module) => module.RadialTreeApiPageComponent,
      ),
    styling: () =>
      import('./radial-tree/sections/styling/radial-tree-styling-page.component').then(
        (module) => module.RadialTreeStylingPageComponent,
      ),
    examples: () =>
      import('./radial-tree/sections/examples/radial-tree-examples-page.component').then(
        (module) => module.RadialTreeExamplesPageComponent,
      ),
  },
  'vertical-tree': {
    overview: () =>
      import('./vertical-tree/sections/overview/vertical-tree-overview-page.component').then(
        (module) => module.VerticalTreeOverviewPageComponent,
      ),
    api: () =>
      import('./vertical-tree/sections/api/vertical-tree-api-page.component').then(
        (module) => module.VerticalTreeApiPageComponent,
      ),
    styling: () =>
      import('./vertical-tree/sections/styling/vertical-tree-styling-page.component').then(
        (module) => module.VerticalTreeStylingPageComponent,
      ),
    examples: () =>
      import('./vertical-tree/sections/examples/vertical-tree-examples-page.component').then(
        (module) => module.VerticalTreeExamplesPageComponent,
      ),
  },
};

export const CHARTS_TREE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, TREE_CHART_SECTION_LOADERS[item.slug]),
  })),
];
