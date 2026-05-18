import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('funnel');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts funnel series docs are empty.');
}

const FUNNEL_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-funnel': {
    overview: () =>
      import('./basic-funnel/sections/overview/basic-funnel-overview-page.component').then(
        (module) => module.BasicFunnelOverviewPageComponent,
      ),
    api: () =>
      import('./basic-funnel/sections/api/basic-funnel-api-page.component').then(
        (module) => module.BasicFunnelApiPageComponent,
      ),
    styling: () =>
      import('./basic-funnel/sections/styling/basic-funnel-styling-page.component').then(
        (module) => module.BasicFunnelStylingPageComponent,
      ),
    examples: () =>
      import('./basic-funnel/sections/examples/basic-funnel-examples-page.component').then(
        (module) => module.BasicFunnelExamplesPageComponent,
      ),
  },
  'compare-funnel': {
    overview: () =>
      import('./compare-funnel/sections/overview/compare-funnel-overview-page.component').then(
        (module) => module.CompareFunnelOverviewPageComponent,
      ),
    api: () =>
      import('./compare-funnel/sections/api/compare-funnel-api-page.component').then(
        (module) => module.CompareFunnelApiPageComponent,
      ),
    styling: () =>
      import('./compare-funnel/sections/styling/compare-funnel-styling-page.component').then(
        (module) => module.CompareFunnelStylingPageComponent,
      ),
    examples: () =>
      import('./compare-funnel/sections/examples/compare-funnel-examples-page.component').then(
        (module) => module.CompareFunnelExamplesPageComponent,
      ),
  },
  'customized-funnel': {
    overview: () =>
      import('./customized-funnel/sections/overview/customized-funnel-overview-page.component').then(
        (module) => module.CustomizedFunnelOverviewPageComponent,
      ),
    api: () =>
      import('./customized-funnel/sections/api/customized-funnel-api-page.component').then(
        (module) => module.CustomizedFunnelApiPageComponent,
      ),
    styling: () =>
      import('./customized-funnel/sections/styling/customized-funnel-styling-page.component').then(
        (module) => module.CustomizedFunnelStylingPageComponent,
      ),
    examples: () =>
      import('./customized-funnel/sections/examples/customized-funnel-examples-page.component').then(
        (module) => module.CustomizedFunnelExamplesPageComponent,
      ),
  },
  'multiple-funnel': {
    overview: () =>
      import('./multiple-funnel/sections/overview/multiple-funnel-overview-page.component').then(
        (module) => module.MultipleFunnelOverviewPageComponent,
      ),
    api: () =>
      import('./multiple-funnel/sections/api/multiple-funnel-api-page.component').then(
        (module) => module.MultipleFunnelApiPageComponent,
      ),
    styling: () =>
      import('./multiple-funnel/sections/styling/multiple-funnel-styling-page.component').then(
        (module) => module.MultipleFunnelStylingPageComponent,
      ),
    examples: () =>
      import('./multiple-funnel/sections/examples/multiple-funnel-examples-page.component').then(
        (module) => module.MultipleFunnelExamplesPageComponent,
      ),
  },
};

export const CHARTS_FUNNEL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, FUNNEL_CHART_SECTION_LOADERS[item.slug]),
  })),
];
