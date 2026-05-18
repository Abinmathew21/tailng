import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('treemap');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts treemap series docs are empty.');
}

const TREEMAP_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'basic-treemap': {
    overview: () =>
      import('./basic-treemap/sections/overview/basic-treemap-overview-page.component').then(
        (module) => module.BasicTreemapOverviewPageComponent,
      ),
    api: () =>
      import('./basic-treemap/sections/api/basic-treemap-api-page.component').then(
        (module) => module.BasicTreemapApiPageComponent,
      ),
    styling: () =>
      import('./basic-treemap/sections/styling/basic-treemap-styling-page.component').then(
        (module) => module.BasicTreemapStylingPageComponent,
      ),
    examples: () =>
      import('./basic-treemap/sections/examples/basic-treemap-examples-page.component').then(
        (module) => module.BasicTreemapExamplesPageComponent,
      ),
  },
  'disk-usage-treemap': {
    overview: () =>
      import('./disk-usage-treemap/sections/overview/disk-usage-treemap-overview-page.component').then(
        (module) => module.DiskUsageTreemapOverviewPageComponent,
      ),
    api: () =>
      import('./disk-usage-treemap/sections/api/disk-usage-treemap-api-page.component').then(
        (module) => module.DiskUsageTreemapApiPageComponent,
      ),
    styling: () =>
      import('./disk-usage-treemap/sections/styling/disk-usage-treemap-styling-page.component').then(
        (module) => module.DiskUsageTreemapStylingPageComponent,
      ),
    examples: () =>
      import('./disk-usage-treemap/sections/examples/disk-usage-treemap-examples-page.component').then(
        (module) => module.DiskUsageTreemapExamplesPageComponent,
      ),
  },
  'gradient-treemap': {
    overview: () =>
      import('./gradient-treemap/sections/overview/gradient-treemap-overview-page.component').then(
        (module) => module.GradientTreemapOverviewPageComponent,
      ),
    api: () =>
      import('./gradient-treemap/sections/api/gradient-treemap-api-page.component').then(
        (module) => module.GradientTreemapApiPageComponent,
      ),
    styling: () =>
      import('./gradient-treemap/sections/styling/gradient-treemap-styling-page.component').then(
        (module) => module.GradientTreemapStylingPageComponent,
      ),
    examples: () =>
      import('./gradient-treemap/sections/examples/gradient-treemap-examples-page.component').then(
        (module) => module.GradientTreemapExamplesPageComponent,
      ),
  },
  'parent-label-treemap': {
    overview: () =>
      import('./parent-label-treemap/sections/overview/parent-label-treemap-overview-page.component').then(
        (module) => module.ParentLabelTreemapOverviewPageComponent,
      ),
    api: () =>
      import('./parent-label-treemap/sections/api/parent-label-treemap-api-page.component').then(
        (module) => module.ParentLabelTreemapApiPageComponent,
      ),
    styling: () =>
      import('./parent-label-treemap/sections/styling/parent-label-treemap-styling-page.component').then(
        (module) => module.ParentLabelTreemapStylingPageComponent,
      ),
    examples: () =>
      import('./parent-label-treemap/sections/examples/parent-label-treemap-examples-page.component').then(
        (module) => module.ParentLabelTreemapExamplesPageComponent,
      ),
  },
};

export const CHARTS_TREEMAP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, TREEMAP_CHART_SECTION_LOADERS[item.slug]),
  })),
];
