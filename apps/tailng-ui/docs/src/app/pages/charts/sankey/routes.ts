import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('sankey');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts sankey series docs are empty.');
}

const SANKEY_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-sankey': {
    overview: () =>
      import('./basic-sankey/sections/overview/basic-sankey-overview-page.component').then(
        (module) => module.BasicSankeyOverviewPageComponent,
      ),
    api: () =>
      import('./basic-sankey/sections/api/basic-sankey-api-page.component').then(
        (module) => module.BasicSankeyApiPageComponent,
      ),
    styling: () =>
      import('./basic-sankey/sections/styling/basic-sankey-styling-page.component').then(
        (module) => module.BasicSankeyStylingPageComponent,
      ),
    examples: () =>
      import('./basic-sankey/sections/examples/basic-sankey-examples-page.component').then(
        (module) => module.BasicSankeyExamplesPageComponent,
      ),
  },
  'gradient-edge-sankey': {
    overview: () =>
      import('./gradient-edge-sankey/sections/overview/gradient-edge-sankey-overview-page.component').then(
        (module) => module.GradientEdgeSankeyOverviewPageComponent,
      ),
    api: () =>
      import('./gradient-edge-sankey/sections/api/gradient-edge-sankey-api-page.component').then(
        (module) => module.GradientEdgeSankeyApiPageComponent,
      ),
    styling: () =>
      import('./gradient-edge-sankey/sections/styling/gradient-edge-sankey-styling-page.component').then(
        (module) => module.GradientEdgeSankeyStylingPageComponent,
      ),
    examples: () =>
      import('./gradient-edge-sankey/sections/examples/gradient-edge-sankey-examples-page.component').then(
        (module) => module.GradientEdgeSankeyExamplesPageComponent,
      ),
  },
  'level-sankey': {
    overview: () =>
      import('./level-sankey/sections/overview/level-sankey-overview-page.component').then(
        (module) => module.LevelSankeyOverviewPageComponent,
      ),
    api: () =>
      import('./level-sankey/sections/api/level-sankey-api-page.component').then(
        (module) => module.LevelSankeyApiPageComponent,
      ),
    styling: () =>
      import('./level-sankey/sections/styling/level-sankey-styling-page.component').then(
        (module) => module.LevelSankeyStylingPageComponent,
      ),
    examples: () =>
      import('./level-sankey/sections/examples/level-sankey-examples-page.component').then(
        (module) => module.LevelSankeyExamplesPageComponent,
      ),
  },
  'node-aligned-sankey': {
    overview: () =>
      import('./node-aligned-sankey/sections/overview/node-aligned-sankey-overview-page.component').then(
        (module) => module.NodeAlignedSankeyOverviewPageComponent,
      ),
    api: () =>
      import('./node-aligned-sankey/sections/api/node-aligned-sankey-api-page.component').then(
        (module) => module.NodeAlignedSankeyApiPageComponent,
      ),
    styling: () =>
      import('./node-aligned-sankey/sections/styling/node-aligned-sankey-styling-page.component').then(
        (module) => module.NodeAlignedSankeyStylingPageComponent,
      ),
    examples: () =>
      import('./node-aligned-sankey/sections/examples/node-aligned-sankey-examples-page.component').then(
        (module) => module.NodeAlignedSankeyExamplesPageComponent,
      ),
  },
  'styled-sankey': {
    overview: () =>
      import('./styled-sankey/sections/overview/styled-sankey-overview-page.component').then(
        (module) => module.StyledSankeyOverviewPageComponent,
      ),
    api: () =>
      import('./styled-sankey/sections/api/styled-sankey-api-page.component').then(
        (module) => module.StyledSankeyApiPageComponent,
      ),
    styling: () =>
      import('./styled-sankey/sections/styling/styled-sankey-styling-page.component').then(
        (module) => module.StyledSankeyStylingPageComponent,
      ),
    examples: () =>
      import('./styled-sankey/sections/examples/styled-sankey-examples-page.component').then(
        (module) => module.StyledSankeyExamplesPageComponent,
      ),
  },
  'vertical-sankey': {
    overview: () =>
      import('./vertical-sankey/sections/overview/vertical-sankey-overview-page.component').then(
        (module) => module.VerticalSankeyOverviewPageComponent,
      ),
    api: () =>
      import('./vertical-sankey/sections/api/vertical-sankey-api-page.component').then(
        (module) => module.VerticalSankeyApiPageComponent,
      ),
    styling: () =>
      import('./vertical-sankey/sections/styling/vertical-sankey-styling-page.component').then(
        (module) => module.VerticalSankeyStylingPageComponent,
      ),
    examples: () =>
      import('./vertical-sankey/sections/examples/vertical-sankey-examples-page.component').then(
        (module) => module.VerticalSankeyExamplesPageComponent,
      ),
  },
};

export const CHARTS_SANKEY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, SANKEY_CHART_SECTION_LOADERS[item.slug]),
  })),
];
