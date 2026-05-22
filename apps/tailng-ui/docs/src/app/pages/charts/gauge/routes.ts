import type { Routes } from '@angular/router';
import { requireChartSeriesDocsGroup } from '../series/chart-series-docs.data';
import {
  buildChartSeriesLocalItemRoutes,
  type ChartSeriesSectionLoaders,
} from '../series/shared/chart-series-local-routes';

const group = requireChartSeriesDocsGroup('gauge');
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts gauge series docs are empty.');
}

const GAUGE_CHART_SECTION_LOADERS: Readonly<Record<string, ChartSeriesSectionLoaders>> = {
  'barometer-gauge': {
    overview: () =>
      import('./barometer-gauge/sections/overview/barometer-gauge-overview-page.component').then(
        (module) => module.BarometerGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./barometer-gauge/sections/api/barometer-gauge-api-page.component').then(
        (module) => module.BarometerGaugeApiPageComponent,
      ),
    styling: () =>
      import('./barometer-gauge/sections/styling/barometer-gauge-styling-page.component').then(
        (module) => module.BarometerGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./barometer-gauge/sections/examples/barometer-gauge-examples-page.component').then(
        (module) => module.BarometerGaugeExamplesPageComponent,
      ),
  },
  'basic-gauge': {
    overview: () =>
      import('./basic-gauge/sections/overview/basic-gauge-overview-page.component').then(
        (module) => module.BasicGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./basic-gauge/sections/api/basic-gauge-api-page.component').then(
        (module) => module.BasicGaugeApiPageComponent,
      ),
    styling: () =>
      import('./basic-gauge/sections/styling/basic-gauge-styling-page.component').then(
        (module) => module.BasicGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./basic-gauge/sections/examples/basic-gauge-examples-page.component').then(
        (module) => module.BasicGaugeExamplesPageComponent,
      ),
  },
  'clock-gauge': {
    overview: () =>
      import('./clock-gauge/sections/overview/clock-gauge-overview-page.component').then(
        (module) => module.ClockGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./clock-gauge/sections/api/clock-gauge-api-page.component').then(
        (module) => module.ClockGaugeApiPageComponent,
      ),
    styling: () =>
      import('./clock-gauge/sections/styling/clock-gauge-styling-page.component').then(
        (module) => module.ClockGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./clock-gauge/sections/examples/clock-gauge-examples-page.component').then(
        (module) => module.ClockGaugeExamplesPageComponent,
      ),
  },
  'grade-gauge': {
    overview: () =>
      import('./grade-gauge/sections/overview/grade-gauge-overview-page.component').then(
        (module) => module.GradeGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./grade-gauge/sections/api/grade-gauge-api-page.component').then(
        (module) => module.GradeGaugeApiPageComponent,
      ),
    styling: () =>
      import('./grade-gauge/sections/styling/grade-gauge-styling-page.component').then(
        (module) => module.GradeGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./grade-gauge/sections/examples/grade-gauge-examples-page.component').then(
        (module) => module.GradeGaugeExamplesPageComponent,
      ),
  },
  'multi-title-gauge': {
    overview: () =>
      import('./multi-title-gauge/sections/overview/multi-title-gauge-overview-page.component').then(
        (module) => module.MultiTitleGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./multi-title-gauge/sections/api/multi-title-gauge-api-page.component').then(
        (module) => module.MultiTitleGaugeApiPageComponent,
      ),
    styling: () =>
      import('./multi-title-gauge/sections/styling/multi-title-gauge-styling-page.component').then(
        (module) => module.MultiTitleGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./multi-title-gauge/sections/examples/multi-title-gauge-examples-page.component').then(
        (module) => module.MultiTitleGaugeExamplesPageComponent,
      ),
  },
  'progress-gauge': {
    overview: () =>
      import('./progress-gauge/sections/overview/progress-gauge-overview-page.component').then(
        (module) => module.ProgressGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./progress-gauge/sections/api/progress-gauge-api-page.component').then(
        (module) => module.ProgressGaugeApiPageComponent,
      ),
    styling: () =>
      import('./progress-gauge/sections/styling/progress-gauge-styling-page.component').then(
        (module) => module.ProgressGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./progress-gauge/sections/examples/progress-gauge-examples-page.component').then(
        (module) => module.ProgressGaugeExamplesPageComponent,
      ),
  },
  'ring-gauge': {
    overview: () =>
      import('./ring-gauge/sections/overview/ring-gauge-overview-page.component').then(
        (module) => module.RingGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./ring-gauge/sections/api/ring-gauge-api-page.component').then(
        (module) => module.RingGaugeApiPageComponent,
      ),
    styling: () =>
      import('./ring-gauge/sections/styling/ring-gauge-styling-page.component').then(
        (module) => module.RingGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./ring-gauge/sections/examples/ring-gauge-examples-page.component').then(
        (module) => module.RingGaugeExamplesPageComponent,
      ),
  },
  'speed-gauge': {
    overview: () =>
      import('./speed-gauge/sections/overview/speed-gauge-overview-page.component').then(
        (module) => module.SpeedGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./speed-gauge/sections/api/speed-gauge-api-page.component').then(
        (module) => module.SpeedGaugeApiPageComponent,
      ),
    styling: () =>
      import('./speed-gauge/sections/styling/speed-gauge-styling-page.component').then(
        (module) => module.SpeedGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./speed-gauge/sections/examples/speed-gauge-examples-page.component').then(
        (module) => module.SpeedGaugeExamplesPageComponent,
      ),
  },
  'temperature-gauge': {
    overview: () =>
      import('./temperature-gauge/sections/overview/temperature-gauge-overview-page.component').then(
        (module) => module.TemperatureGaugeOverviewPageComponent,
      ),
    api: () =>
      import('./temperature-gauge/sections/api/temperature-gauge-api-page.component').then(
        (module) => module.TemperatureGaugeApiPageComponent,
      ),
    styling: () =>
      import('./temperature-gauge/sections/styling/temperature-gauge-styling-page.component').then(
        (module) => module.TemperatureGaugeStylingPageComponent,
      ),
    examples: () =>
      import('./temperature-gauge/sections/examples/temperature-gauge-examples-page.component').then(
        (module) => module.TemperatureGaugeExamplesPageComponent,
      ),
  },
};

export const CHARTS_GAUGE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  ...group.items.map((item) => ({
    path: item.slug,
    children: buildChartSeriesLocalItemRoutes(group, item, GAUGE_CHART_SECTION_LOADERS[item.slug]),
  })),
];
