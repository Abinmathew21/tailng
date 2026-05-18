import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('sunburst');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts sunburst series docs are empty.');
}

const SUNBURST_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-sunburst': {
    overview: () =>
      import('./basic-sunburst/sections/overview/basic-sunburst-overview-page.component').then(
        (module) => module.BasicSunburstOverviewPageComponent,
      ),
    api: () =>
      import('./basic-sunburst/sections/api/basic-sunburst-api-page.component').then(
        (module) => module.BasicSunburstApiPageComponent,
      ),
    styling: () =>
      import('./basic-sunburst/sections/styling/basic-sunburst-styling-page.component').then(
        (module) => module.BasicSunburstStylingPageComponent,
      ),
    examples: () =>
      import('./basic-sunburst/sections/examples/basic-sunburst-examples-page.component').then(
        (module) => module.BasicSunburstExamplesPageComponent,
      ),
  },
  'monochrome-sunburst': {
    overview: () =>
      import('./monochrome-sunburst/sections/overview/monochrome-sunburst-overview-page.component').then(
        (module) => module.MonochromeSunburstOverviewPageComponent,
      ),
    api: () =>
      import('./monochrome-sunburst/sections/api/monochrome-sunburst-api-page.component').then(
        (module) => module.MonochromeSunburstApiPageComponent,
      ),
    styling: () =>
      import('./monochrome-sunburst/sections/styling/monochrome-sunburst-styling-page.component').then(
        (module) => module.MonochromeSunburstStylingPageComponent,
      ),
    examples: () =>
      import('./monochrome-sunburst/sections/examples/monochrome-sunburst-examples-page.component').then(
        (module) => module.MonochromeSunburstExamplesPageComponent,
      ),
  },
  'rotated-label-sunburst': {
    overview: () =>
      import('./rotated-label-sunburst/sections/overview/rotated-label-sunburst-overview-page.component').then(
        (module) => module.RotatedLabelSunburstOverviewPageComponent,
      ),
    api: () =>
      import('./rotated-label-sunburst/sections/api/rotated-label-sunburst-api-page.component').then(
        (module) => module.RotatedLabelSunburstApiPageComponent,
      ),
    styling: () =>
      import('./rotated-label-sunburst/sections/styling/rotated-label-sunburst-styling-page.component').then(
        (module) => module.RotatedLabelSunburstStylingPageComponent,
      ),
    examples: () =>
      import('./rotated-label-sunburst/sections/examples/rotated-label-sunburst-examples-page.component').then(
        (module) => module.RotatedLabelSunburstExamplesPageComponent,
      ),
  },
  'rounded-sunburst': {
    overview: () =>
      import('./rounded-sunburst/sections/overview/rounded-sunburst-overview-page.component').then(
        (module) => module.RoundedSunburstOverviewPageComponent,
      ),
    api: () =>
      import('./rounded-sunburst/sections/api/rounded-sunburst-api-page.component').then(
        (module) => module.RoundedSunburstApiPageComponent,
      ),
    styling: () =>
      import('./rounded-sunburst/sections/styling/rounded-sunburst-styling-page.component').then(
        (module) => module.RoundedSunburstStylingPageComponent,
      ),
    examples: () =>
      import('./rounded-sunburst/sections/examples/rounded-sunburst-examples-page.component').then(
        (module) => module.RoundedSunburstExamplesPageComponent,
      ),
  },
  'visual-map-sunburst': {
    overview: () =>
      import('./visual-map-sunburst/sections/overview/visual-map-sunburst-overview-page.component').then(
        (module) => module.VisualMapSunburstOverviewPageComponent,
      ),
    api: () =>
      import('./visual-map-sunburst/sections/api/visual-map-sunburst-api-page.component').then(
        (module) => module.VisualMapSunburstApiPageComponent,
      ),
    styling: () =>
      import('./visual-map-sunburst/sections/styling/visual-map-sunburst-styling-page.component').then(
        (module) => module.VisualMapSunburstStylingPageComponent,
      ),
    examples: () =>
      import('./visual-map-sunburst/sections/examples/visual-map-sunburst-examples-page.component').then(
        (module) => module.VisualMapSunburstExamplesPageComponent,
      ),
  },
};

export const CHARTS_SUNBURST_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, SUNBURST_CHART_SECTION_LOADERS[item.slug]),
  })),
];
