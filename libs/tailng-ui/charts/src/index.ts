export type {
  TngChartInitOptions,
  TngChartInstance,
  TngChartOption,
  TngChartRenderer,
  TngChartRuntime,
  TngChartRuntimeLoader,
  TngChartSetOptionOptions,
  TngChartTheme,
} from './lib/chart.types';

export { loadTngEchartsRuntime, resolveTngEchartsModule } from './lib/echarts.loader';

export {
  resolveTngChartNotMerge,
  resolveTngChartRenderer,
  shouldAttachTngChartResizeObserver,
  TngChart,
} from './lib/tng-chart.component';

export type {
  TngBarChartInput,
  TngBarChartKind,
  TngBarSeriesInput,
} from './lib/series/bar/bar.types';

export { createTngBarChartOption } from './lib/series/bar/bar.option-builder';

export { TngBarChart } from './lib/series/bar/tng-bar-chart.component';
