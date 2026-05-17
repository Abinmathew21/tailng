import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';

type ChartSeriesPilotSectionLoader = () => Promise<Type<unknown>>;

type ChartSeriesPilotSectionLoaders = Readonly<{
  overview: ChartSeriesPilotSectionLoader;
  api: ChartSeriesPilotSectionLoader;
  styling: ChartSeriesPilotSectionLoader;
  examples: ChartSeriesPilotSectionLoader;
}>;

const PILOT_SECTION_LOADERS: Readonly<Record<string, ChartSeriesPilotSectionLoaders>> = {
  'line/basic-line': {
    overview: () =>
      import('../line/basic-line/sections/overview/basic-line-overview-page.component').then(
        (module) => module.BasicLineOverviewPageComponent,
      ),
    api: () =>
      import('../line/basic-line/sections/api/basic-line-api-page.component').then(
        (module) => module.BasicLineApiPageComponent,
      ),
    styling: () =>
      import('../line/basic-line/sections/styling/basic-line-styling-page.component').then(
        (module) => module.BasicLineStylingPageComponent,
      ),
    examples: () =>
      import('../line/basic-line/sections/examples/basic-line-examples-page.component').then(
        (module) => module.BasicLineExamplesPageComponent,
      ),
  },
  'bar/stacked-bar': {
    overview: () =>
      import('../../bar/stacked-bar/sections/overview/stacked-bar-overview-page.component').then(
        (module) => module.StackedBarOverviewPageComponent,
      ),
    api: () =>
      import('../../bar/stacked-bar/sections/api/stacked-bar-api-page.component').then(
        (module) => module.StackedBarApiPageComponent,
      ),
    styling: () =>
      import('../../bar/stacked-bar/sections/styling/stacked-bar-styling-page.component').then(
        (module) => module.StackedBarStylingPageComponent,
      ),
    examples: () =>
      import('../../bar/stacked-bar/sections/examples/stacked-bar-examples-page.component').then(
        (module) => module.StackedBarExamplesPageComponent,
      ),
  },
  'pie/donut': {
    overview: () =>
      import('../pie/donut/sections/overview/donut-overview-page.component').then(
        (module) => module.DonutOverviewPageComponent,
      ),
    api: () =>
      import('../pie/donut/sections/api/donut-api-page.component').then(
        (module) => module.DonutApiPageComponent,
      ),
    styling: () =>
      import('../pie/donut/sections/styling/donut-styling-page.component').then(
        (module) => module.DonutStylingPageComponent,
      ),
    examples: () =>
      import('../pie/donut/sections/examples/donut-examples-page.component').then(
        (module) => module.DonutExamplesPageComponent,
      ),
  },
};

const CATALOG_OVERVIEW_LOADER = () =>
  import('../catalog/chart-series-catalog-overview-page.component').then(
    (module) => module.ChartSeriesCatalogOverviewPageComponent,
  );

const CATALOG_API_LOADER = () =>
  import('../catalog/chart-series-catalog-api-page.component').then(
    (module) => module.ChartSeriesCatalogApiPageComponent,
  );

const CATALOG_STYLING_LOADER = () =>
  import('../catalog/chart-series-catalog-styling-page.component').then(
    (module) => module.ChartSeriesCatalogStylingPageComponent,
  );

const CATALOG_EXAMPLES_LOADER = () =>
  import('../catalog/chart-series-catalog-examples-page.component').then(
    (module) => module.ChartSeriesCatalogExamplesPageComponent,
  );

function resolvePilotKey(categoryId: string, slug: string): string {
  return `${categoryId}/${slug}`;
}

function resolvePilotLoaders(
  categoryId: string,
  slug: string,
): ChartSeriesPilotSectionLoaders | null {
  return PILOT_SECTION_LOADERS[resolvePilotKey(categoryId, slug)] ?? null;
}

export function isChartSeriesPilotChart(categoryId: string, slug: string): boolean {
  return resolvePilotKey(categoryId, slug) in PILOT_SECTION_LOADERS;
}

function buildPilotSectionRoute(
  path: string,
  pilotLoader: ChartSeriesPilotSectionLoader | undefined,
  catalogLoader: ChartSeriesPilotSectionLoader,
): Routes[number] {
  return {
    path,
    loadComponent: pilotLoader ?? catalogLoader,
  };
}

export function buildChartSeriesPilotChildRoutes(
  categoryId: string,
  slug: string,
): readonly Routes[number][] {
  const pilot = resolvePilotLoaders(categoryId, slug);

  return [
    buildPilotSectionRoute('overview', pilot?.overview, CATALOG_OVERVIEW_LOADER),
    buildPilotSectionRoute('api', pilot?.api, CATALOG_API_LOADER),
    buildPilotSectionRoute('styling', pilot?.styling, CATALOG_STYLING_LOADER),
    buildPilotSectionRoute('examples', pilot?.examples, CATALOG_EXAMPLES_LOADER),
  ];
}
