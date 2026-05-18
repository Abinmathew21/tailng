import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('area');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts area series docs are empty.');
}

const AREA_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'area-chart': {
    overview: () =>
      import('./area-chart/sections/overview/area-chart-overview-page.component').then(
        (module) => module.AreaChartOverviewPageComponent,
      ),
    api: () =>
      import('./area-chart/sections/api/area-chart-api-page.component').then(
        (module) => module.AreaChartApiPageComponent,
      ),
    styling: () =>
      import('./area-chart/sections/styling/area-chart-styling-page.component').then(
        (module) => module.AreaChartStylingPageComponent,
      ),
    examples: () =>
      import('./area-chart/sections/examples/area-chart-examples-page.component').then(
        (module) => module.AreaChartExamplesPageComponent,
      ),
  },
  'area-pieces': {
    overview: () =>
      import('./area-pieces/sections/overview/area-pieces-overview-page.component').then(
        (module) => module.AreaPiecesOverviewPageComponent,
      ),
    api: () =>
      import('./area-pieces/sections/api/area-pieces-api-page.component').then(
        (module) => module.AreaPiecesApiPageComponent,
      ),
    styling: () =>
      import('./area-pieces/sections/styling/area-pieces-styling-page.component').then(
        (module) => module.AreaPiecesStylingPageComponent,
      ),
    examples: () =>
      import('./area-pieces/sections/examples/area-pieces-examples-page.component').then(
        (module) => module.AreaPiecesExamplesPageComponent,
      ),
  },
  'basic-area': {
    overview: () =>
      import('./basic-area/sections/overview/basic-area-overview-page.component').then(
        (module) => module.BasicAreaOverviewPageComponent,
      ),
    api: () =>
      import('./basic-area/sections/api/basic-area-api-page.component').then(
        (module) => module.BasicAreaApiPageComponent,
      ),
    styling: () =>
      import('./basic-area/sections/styling/basic-area-styling-page.component').then(
        (module) => module.BasicAreaStylingPageComponent,
      ),
    examples: () =>
      import('./basic-area/sections/examples/basic-area-examples-page.component').then(
        (module) => module.BasicAreaExamplesPageComponent,
      ),
  },
  'confidence-band': {
    overview: () =>
      import('./confidence-band/sections/overview/confidence-band-overview-page.component').then(
        (module) => module.ConfidenceBandOverviewPageComponent,
      ),
    api: () =>
      import('./confidence-band/sections/api/confidence-band-api-page.component').then(
        (module) => module.ConfidenceBandApiPageComponent,
      ),
    styling: () =>
      import('./confidence-band/sections/styling/confidence-band-styling-page.component').then(
        (module) => module.ConfidenceBandStylingPageComponent,
      ),
    examples: () =>
      import('./confidence-band/sections/examples/confidence-band-examples-page.component').then(
        (module) => module.ConfidenceBandExamplesPageComponent,
      ),
  },
  'gradient-area': {
    overview: () =>
      import('./gradient-area/sections/overview/gradient-area-overview-page.component').then(
        (module) => module.GradientAreaOverviewPageComponent,
      ),
    api: () =>
      import('./gradient-area/sections/api/gradient-area-api-page.component').then(
        (module) => module.GradientAreaApiPageComponent,
      ),
    styling: () =>
      import('./gradient-area/sections/styling/gradient-area-styling-page.component').then(
        (module) => module.GradientAreaStylingPageComponent,
      ),
    examples: () =>
      import('./gradient-area/sections/examples/gradient-area-examples-page.component').then(
        (module) => module.GradientAreaExamplesPageComponent,
      ),
  },
  'large-scale-area': {
    overview: () =>
      import('./large-scale-area/sections/overview/large-scale-area-overview-page.component').then(
        (module) => module.LargeScaleAreaOverviewPageComponent,
      ),
    api: () =>
      import('./large-scale-area/sections/api/large-scale-area-api-page.component').then(
        (module) => module.LargeScaleAreaApiPageComponent,
      ),
    styling: () =>
      import('./large-scale-area/sections/styling/large-scale-area-styling-page.component').then(
        (module) => module.LargeScaleAreaStylingPageComponent,
      ),
    examples: () =>
      import('./large-scale-area/sections/examples/large-scale-area-examples-page.component').then(
        (module) => module.LargeScaleAreaExamplesPageComponent,
      ),
  },
  'stacked-area': {
    overview: () =>
      import('./stacked-area/sections/overview/stacked-area-overview-page.component').then(
        (module) => module.StackedAreaOverviewPageComponent,
      ),
    api: () =>
      import('./stacked-area/sections/api/stacked-area-api-page.component').then(
        (module) => module.StackedAreaApiPageComponent,
      ),
    styling: () =>
      import('./stacked-area/sections/styling/stacked-area-styling-page.component').then(
        (module) => module.StackedAreaStylingPageComponent,
      ),
    examples: () =>
      import('./stacked-area/sections/examples/stacked-area-examples-page.component').then(
        (module) => module.StackedAreaExamplesPageComponent,
      ),
  },
  'time-series-area': {
    overview: () =>
      import('./time-series-area/sections/overview/time-series-area-overview-page.component').then(
        (module) => module.TimeSeriesAreaOverviewPageComponent,
      ),
    api: () =>
      import('./time-series-area/sections/api/time-series-area-api-page.component').then(
        (module) => module.TimeSeriesAreaApiPageComponent,
      ),
    styling: () =>
      import('./time-series-area/sections/styling/time-series-area-styling-page.component').then(
        (module) => module.TimeSeriesAreaStylingPageComponent,
      ),
    examples: () =>
      import('./time-series-area/sections/examples/time-series-area-examples-page.component').then(
        (module) => module.TimeSeriesAreaExamplesPageComponent,
      ),
  },
};

export const CHARTS_AREA_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, AREA_CHART_SECTION_LOADERS[item.slug]),
  })),
];
