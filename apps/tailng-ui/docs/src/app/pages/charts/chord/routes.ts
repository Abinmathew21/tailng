import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('chord');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts chord series docs are empty.');
}

const CHORD_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-chord': {
    overview: () =>
      import('./basic-chord/sections/overview/basic-chord-overview-page.component').then(
        (module) => module.BasicChordOverviewPageComponent,
      ),
    api: () =>
      import('./basic-chord/sections/api/basic-chord-api-page.component').then(
        (module) => module.BasicChordApiPageComponent,
      ),
    styling: () =>
      import('./basic-chord/sections/styling/basic-chord-styling-page.component').then(
        (module) => module.BasicChordStylingPageComponent,
      ),
    examples: () =>
      import('./basic-chord/sections/examples/basic-chord-examples-page.component').then(
        (module) => module.BasicChordExamplesPageComponent,
      ),
  },
  'chord-line-style-color': {
    overview: () =>
      import('./chord-line-style-color/sections/overview/chord-line-style-color-overview-page.component').then(
        (module) => module.ChordLineStyleColorOverviewPageComponent,
      ),
    api: () =>
      import('./chord-line-style-color/sections/api/chord-line-style-color-api-page.component').then(
        (module) => module.ChordLineStyleColorApiPageComponent,
      ),
    styling: () =>
      import('./chord-line-style-color/sections/styling/chord-line-style-color-styling-page.component').then(
        (module) => module.ChordLineStyleColorStylingPageComponent,
      ),
    examples: () =>
      import('./chord-line-style-color/sections/examples/chord-line-style-color-examples-page.component').then(
        (module) => module.ChordLineStyleColorExamplesPageComponent,
      ),
  },
  'chord-min-angle': {
    overview: () =>
      import('./chord-min-angle/sections/overview/chord-min-angle-overview-page.component').then(
        (module) => module.ChordMinAngleOverviewPageComponent,
      ),
    api: () =>
      import('./chord-min-angle/sections/api/chord-min-angle-api-page.component').then(
        (module) => module.ChordMinAngleApiPageComponent,
      ),
    styling: () =>
      import('./chord-min-angle/sections/styling/chord-min-angle-styling-page.component').then(
        (module) => module.ChordMinAngleStylingPageComponent,
      ),
    examples: () =>
      import('./chord-min-angle/sections/examples/chord-min-angle-examples-page.component').then(
        (module) => module.ChordMinAngleExamplesPageComponent,
      ),
  },
  'styled-chord': {
    overview: () =>
      import('./styled-chord/sections/overview/styled-chord-overview-page.component').then(
        (module) => module.StyledChordOverviewPageComponent,
      ),
    api: () =>
      import('./styled-chord/sections/api/styled-chord-api-page.component').then(
        (module) => module.StyledChordApiPageComponent,
      ),
    styling: () =>
      import('./styled-chord/sections/styling/styled-chord-styling-page.component').then(
        (module) => module.StyledChordStylingPageComponent,
      ),
    examples: () =>
      import('./styled-chord/sections/examples/styled-chord-examples-page.component').then(
        (module) => module.StyledChordExamplesPageComponent,
      ),
  },
};

export const CHARTS_CHORD_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, CHORD_CHART_SECTION_LOADERS[item.slug]),
  })),
];
