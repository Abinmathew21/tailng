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
