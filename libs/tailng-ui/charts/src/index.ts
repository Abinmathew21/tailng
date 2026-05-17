export type {
  TngChartData,
  TngChartDatum,
  TngChartHeight,
  TngChartInitOptions,
  TngChartInstance,
  TngChartOption,
  TngChartOptionOverride,
  TngChartPointEvent,
  TngChartRenderer,
  TngChartRuntime,
  TngChartRuntimeLoader,
  TngChartSetOptionOptions,
  TngChartTheme,
} from './lib/core/chart.types';
export type {
  TngChartContext,
  TngChartOptionFactory,
} from './lib/core/chart-context';
export {
  TNG_CHART_CONTEXT,
} from './lib/core/chart-context';
export type {
  TngChartLegendItem,
  TngChartSeries,
  TngChartSeriesType,
} from './lib/core/chart-series.types';

export { loadTngEchartsRuntime, resolveTngEchartsModule } from './lib/echarts/echarts.loader';

export {
  resolveTngChartNotMerge,
  resolveTngChartRenderer,
  shouldAttachTngChartResizeObserver,
  shouldScheduleTngChartResizeFrame,
  TngChartComponent,
  TngChartComponent as TngChart,
} from './lib/components/chart/tng-chart.component';
export { TngChartRootComponent } from './lib/components/chart-root/tng-chart-root.component';
export {
  TngChartSurfaceComponent,
} from './lib/components/chart-surface/tng-chart-surface.component';
export { TngChartLegendComponent } from './lib/components/legend/tng-chart-legend.component';
export { TngChartEmptyStateComponent } from './lib/components/empty-state/tng-chart-empty-state.component';
export { TngChartLoadingStateComponent } from './lib/components/loading-state/tng-chart-loading-state.component';

export type {
  TngAreaChartOptionInput,
} from './lib/series/area/area-chart.types';
export { createTngAreaChartOption } from './lib/series/area/area-option.factory';
export {
  TngAreaChartComponent,
  TngAreaChartComponent as TngAreaChart,
} from './lib/series/area/tng-area-chart.component';

export type {
  TngBarChartInput,
  TngBarChartKind,
  TngBarChartOptionInput,
  TngBarChartOrientation,
  TngBarSeriesInput,
} from './lib/series/bar/bar.types';
export { createTngBarChartOption } from './lib/series/bar/bar-option.factory';
export {
  TngBarChartComponent,
  TngBarChartComponent as TngBarChart,
} from './lib/series/bar/tng-bar-chart.component';

export type {
  TngHeatmapChartOptionInput,
} from './lib/series/heatmap/heatmap-chart.types';
export { createTngHeatmapChartOption } from './lib/series/heatmap/heatmap-option.factory';
export {
  TngHeatmapChartComponent,
  TngHeatmapChartComponent as TngHeatmapChart,
} from './lib/series/heatmap/tng-heatmap-chart.component';

export type {
  TngLineChartInput,
  TngLineChartOptionInput,
  TngLineSeriesInput,
} from './lib/series/line/line.types';
export { createTngLineChartOption } from './lib/series/line/line-option.factory';
export {
  TngLineChartComponent,
  TngLineChartComponent as TngLineChart,
} from './lib/series/line/tng-line-chart.component';

export type {
  TngPieChartInput,
  TngPieChartOptionInput,
  TngPieSliceInput,
} from './lib/series/pie/pie.types';
export { createTngPieChartOption } from './lib/series/pie/pie-option.factory';
export {
  TngPieChartComponent,
  TngPieChartComponent as TngPieChart,
} from './lib/series/pie/tng-pie-chart.component';

export type {
  TngScatterChartOptionInput,
} from './lib/series/scatter/scatter-chart.types';
export { createTngScatterChartOption } from './lib/series/scatter/scatter-option.factory';
export {
  TngScatterChartComponent,
  TngScatterChartComponent as TngScatterChart,
} from './lib/series/scatter/tng-scatter-chart.component';
