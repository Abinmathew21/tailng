import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('theme-river');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts theme river series docs are empty.');
}

const THEME_RIVER_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-theme-river': {
    overview: () =>
      import('./basic-theme-river/sections/overview/basic-theme-river-overview-page.component').then(
        (module) => module.BasicThemeRiverOverviewPageComponent,
      ),
    api: () =>
      import('./basic-theme-river/sections/api/basic-theme-river-api-page.component').then(
        (module) => module.BasicThemeRiverApiPageComponent,
      ),
    styling: () =>
      import('./basic-theme-river/sections/styling/basic-theme-river-styling-page.component').then(
        (module) => module.BasicThemeRiverStylingPageComponent,
      ),
    examples: () =>
      import('./basic-theme-river/sections/examples/basic-theme-river-examples-page.component').then(
        (module) => module.BasicThemeRiverExamplesPageComponent,
      ),
  },
};

export const CHARTS_THEME_RIVER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, THEME_RIVER_CHART_SECTION_LOADERS[item.slug]),
  })),
];
