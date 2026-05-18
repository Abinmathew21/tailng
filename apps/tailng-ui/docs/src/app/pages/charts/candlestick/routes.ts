import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('candlestick');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts candlestick series docs are empty.');
}

const CANDLESTICK_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-candlestick': {
    overview: () =>
      import('./basic-candlestick/sections/overview/basic-candlestick-overview-page.component').then(
        (module) => module.BasicCandlestickOverviewPageComponent,
      ),
    api: () =>
      import('./basic-candlestick/sections/api/basic-candlestick-api-page.component').then(
        (module) => module.BasicCandlestickApiPageComponent,
      ),
    styling: () =>
      import('./basic-candlestick/sections/styling/basic-candlestick-styling-page.component').then(
        (module) => module.BasicCandlestickStylingPageComponent,
      ),
    examples: () =>
      import('./basic-candlestick/sections/examples/basic-candlestick-examples-page.component').then(
        (module) => module.BasicCandlestickExamplesPageComponent,
      ),
  },
  'candlestick-with-brush': {
    overview: () =>
      import('./candlestick-with-brush/sections/overview/candlestick-with-brush-overview-page.component').then(
        (module) => module.CandlestickWithBrushOverviewPageComponent,
      ),
    api: () =>
      import('./candlestick-with-brush/sections/api/candlestick-with-brush-api-page.component').then(
        (module) => module.CandlestickWithBrushApiPageComponent,
      ),
    styling: () =>
      import('./candlestick-with-brush/sections/styling/candlestick-with-brush-styling-page.component').then(
        (module) => module.CandlestickWithBrushStylingPageComponent,
      ),
    examples: () =>
      import('./candlestick-with-brush/sections/examples/candlestick-with-brush-examples-page.component').then(
        (module) => module.CandlestickWithBrushExamplesPageComponent,
      ),
  },
  'intraday-candlestick': {
    overview: () =>
      import('./intraday-candlestick/sections/overview/intraday-candlestick-overview-page.component').then(
        (module) => module.IntradayCandlestickOverviewPageComponent,
      ),
    api: () =>
      import('./intraday-candlestick/sections/api/intraday-candlestick-api-page.component').then(
        (module) => module.IntradayCandlestickApiPageComponent,
      ),
    styling: () =>
      import('./intraday-candlestick/sections/styling/intraday-candlestick-styling-page.component').then(
        (module) => module.IntradayCandlestickStylingPageComponent,
      ),
    examples: () =>
      import('./intraday-candlestick/sections/examples/intraday-candlestick-examples-page.component').then(
        (module) => module.IntradayCandlestickExamplesPageComponent,
      ),
  },
  'large-scale-candlestick': {
    overview: () =>
      import('./large-scale-candlestick/sections/overview/large-scale-candlestick-overview-page.component').then(
        (module) => module.LargeScaleCandlestickOverviewPageComponent,
      ),
    api: () =>
      import('./large-scale-candlestick/sections/api/large-scale-candlestick-api-page.component').then(
        (module) => module.LargeScaleCandlestickApiPageComponent,
      ),
    styling: () =>
      import('./large-scale-candlestick/sections/styling/large-scale-candlestick-styling-page.component').then(
        (module) => module.LargeScaleCandlestickStylingPageComponent,
      ),
    examples: () =>
      import('./large-scale-candlestick/sections/examples/large-scale-candlestick-examples-page.component').then(
        (module) => module.LargeScaleCandlestickExamplesPageComponent,
      ),
  },
  'ohlc': {
    overview: () =>
      import('./ohlc/sections/overview/ohlc-overview-page.component').then(
        (module) => module.OhlcOverviewPageComponent,
      ),
    api: () =>
      import('./ohlc/sections/api/ohlc-api-page.component').then(
        (module) => module.OhlcApiPageComponent,
      ),
    styling: () =>
      import('./ohlc/sections/styling/ohlc-styling-page.component').then(
        (module) => module.OhlcStylingPageComponent,
      ),
    examples: () =>
      import('./ohlc/sections/examples/ohlc-examples-page.component').then(
        (module) => module.OhlcExamplesPageComponent,
      ),
  },
};

export const CHARTS_CANDLESTICK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, CANDLESTICK_CHART_SECTION_LOADERS[item.slug]),
  })),
];
