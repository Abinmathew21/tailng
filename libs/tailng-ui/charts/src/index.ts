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
  TngChartComponent,
  TngChartComponent as TngChart,
} from './lib/tng-chart.component';

export type {
  TngBarChartInput,
  TngBarChartKind,
  TngBarSeriesInput,
} from './lib/series/bar/bar.types';

export { createTngBarChartOption } from './lib/series/bar/bar.option-builder';

export { TngBarChartComponent, TngBarChartComponent as TngBarChart } from './lib/series/bar/tng-bar-chart.component';

export type { TngLineChartInput, TngLineSeriesInput } from './lib/series/line/line.types';

export { createTngLineChartOption } from './lib/series/line/line.option-builder';

export { TngLineChartComponent, TngLineChartComponent as TngLineChart } from './lib/series/line/tng-line-chart.component';
