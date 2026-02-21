export type {
  TngChartOption,
  TngChartRenderer,
  TngChartTheme,
  TngEchartInitOptions,
  TngEchartInstance,
  TngEchartSetOptionOptions,
  TngEchartsModule,
  TngEchartsModuleLoader,
} from './lib/chart.types';

export { loadTngEchartsRuntime, resolveTngEchartsModule } from './lib/echarts.loader';

export {
  resolveTngChartNotMerge,
  resolveTngChartRenderer,
  shouldAttachTngChartResizeObserver,
  TngEchart,
} from './lib/tng-echart.component';
