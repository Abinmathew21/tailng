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
      import('../bar/stacked-bar/sections/overview/stacked-bar-overview-page.component').then(
        (module) => module.StackedBarOverviewPageComponent,
      ),
    api: () =>
      import('../bar/stacked-bar/sections/api/stacked-bar-api-page.component').then(
        (module) => module.StackedBarApiPageComponent,
      ),
    styling: () =>
      import('../bar/stacked-bar/sections/styling/stacked-bar-styling-page.component').then(
        (module) => module.StackedBarStylingPageComponent,
      ),
    examples: () =>
      import('../bar/stacked-bar/sections/examples/stacked-bar-examples-page.component').then(
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

const GENERIC_OVERVIEW_LOADER = () =>
  import('../sections/overview/chart-series-overview-page.component').then(
    (module) => module.ChartSeriesOverviewPageComponent,
  );

const GENERIC_API_LOADER = () =>
  import('../sections/api/chart-series-api-page.component').then(
    (module) => module.ChartSeriesApiPageComponent,
  );

const GENERIC_STYLING_LOADER = () =>
  import('../sections/styling/chart-series-styling-page.component').then(
    (module) => module.ChartSeriesStylingPageComponent,
  );

const GENERIC_EXAMPLES_LOADER = () =>
  import('../sections/examples/chart-series-examples-page.component').then(
    (module) => module.ChartSeriesExamplesPageComponent,
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
  genericLoader: ChartSeriesPilotSectionLoader,
): Routes[number] {
  return {
    path,
    loadComponent: pilotLoader ?? genericLoader,
  };
}

export function buildChartSeriesPilotChildRoutes(
  categoryId: string,
  slug: string,
): readonly Routes[number][] {
  const pilot = resolvePilotLoaders(categoryId, slug);

  return [
    buildPilotSectionRoute('overview', pilot?.overview, GENERIC_OVERVIEW_LOADER),
    buildPilotSectionRoute('api', pilot?.api, GENERIC_API_LOADER),
    buildPilotSectionRoute('styling', pilot?.styling, GENERIC_STYLING_LOADER),
    buildPilotSectionRoute('examples', pilot?.examples, GENERIC_EXAMPLES_LOADER),
  ];
}
