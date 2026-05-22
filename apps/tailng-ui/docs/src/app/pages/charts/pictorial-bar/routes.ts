import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('pictorial-bar');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts pictorial bar series docs are empty.');
}

const PICTORIAL_BAR_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-pictorial-bar': {
    overview: () =>
      import('./basic-pictorial-bar/sections/overview/basic-pictorial-bar-overview-page.component').then(
        (module) => module.BasicPictorialBarOverviewPageComponent,
      ),
    api: () =>
      import('./basic-pictorial-bar/sections/api/basic-pictorial-bar-api-page.component').then(
        (module) => module.BasicPictorialBarApiPageComponent,
      ),
    styling: () =>
      import('./basic-pictorial-bar/sections/styling/basic-pictorial-bar-styling-page.component').then(
        (module) => module.BasicPictorialBarStylingPageComponent,
      ),
    examples: () =>
      import('./basic-pictorial-bar/sections/examples/basic-pictorial-bar-examples-page.component').then(
        (module) => module.BasicPictorialBarExamplesPageComponent,
      ),
  },
  'dotted-pictorial-bar': {
    overview: () =>
      import('./dotted-pictorial-bar/sections/overview/dotted-pictorial-bar-overview-page.component').then(
        (module) => module.DottedPictorialBarOverviewPageComponent,
      ),
    api: () =>
      import('./dotted-pictorial-bar/sections/api/dotted-pictorial-bar-api-page.component').then(
        (module) => module.DottedPictorialBarApiPageComponent,
      ),
    styling: () =>
      import('./dotted-pictorial-bar/sections/styling/dotted-pictorial-bar-styling-page.component').then(
        (module) => module.DottedPictorialBarStylingPageComponent,
      ),
    examples: () =>
      import('./dotted-pictorial-bar/sections/examples/dotted-pictorial-bar-examples-page.component').then(
        (module) => module.DottedPictorialBarExamplesPageComponent,
      ),
  },
  'image-svg-pictorial-bar': {
    overview: () =>
      import('./image-svg-pictorial-bar/sections/overview/image-svg-pictorial-bar-overview-page.component').then(
        (module) => module.ImageSvgPictorialBarOverviewPageComponent,
      ),
    api: () =>
      import('./image-svg-pictorial-bar/sections/api/image-svg-pictorial-bar-api-page.component').then(
        (module) => module.ImageSvgPictorialBarApiPageComponent,
      ),
    styling: () =>
      import('./image-svg-pictorial-bar/sections/styling/image-svg-pictorial-bar-styling-page.component').then(
        (module) => module.ImageSvgPictorialBarStylingPageComponent,
      ),
    examples: () =>
      import('./image-svg-pictorial-bar/sections/examples/image-svg-pictorial-bar-examples-page.component').then(
        (module) => module.ImageSvgPictorialBarExamplesPageComponent,
      ),
  },
  'symbol-pictorial-bar': {
    overview: () =>
      import('./symbol-pictorial-bar/sections/overview/symbol-pictorial-bar-overview-page.component').then(
        (module) => module.SymbolPictorialBarOverviewPageComponent,
      ),
    api: () =>
      import('./symbol-pictorial-bar/sections/api/symbol-pictorial-bar-api-page.component').then(
        (module) => module.SymbolPictorialBarApiPageComponent,
      ),
    styling: () =>
      import('./symbol-pictorial-bar/sections/styling/symbol-pictorial-bar-styling-page.component').then(
        (module) => module.SymbolPictorialBarStylingPageComponent,
      ),
    examples: () =>
      import('./symbol-pictorial-bar/sections/examples/symbol-pictorial-bar-examples-page.component').then(
        (module) => module.SymbolPictorialBarExamplesPageComponent,
      ),
  },
};

export const CHARTS_PICTORIAL_BAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, PICTORIAL_BAR_CHART_SECTION_LOADERS[item.slug]),
  })),
];
