export type TngChartDatum = Readonly<Record<string, unknown>>;

export type TngChartData = readonly TngChartDatum[];

export type TngChartOption = Readonly<Record<string, unknown>>;

export type TngChartOptionOverride = (option: TngChartOption) => TngChartOption;

export type TngChartTheme = Readonly<Record<string, unknown>> | string | null;

export type TngChartRenderer = 'canvas' | 'svg';

export type TngChartRuntimeLoader = () => Promise<unknown>;

export type TngChartHeight = number | string;

export type TngChartSetOptionOptions = Readonly<{
  lazyUpdate?: boolean;
  notMerge?: boolean;
}>;

export type TngChartInitOptions = Readonly<{
  renderer?: TngChartRenderer;
}>;

export type TngChartInstance = Readonly<{
  dispose: () => void;
  hideLoading?: () => void;
  off?: (eventName: string, handler: (event: unknown) => void) => void;
  on?: (eventName: string, handler: (event: unknown) => void) => void;
  resize: () => void;
  setOption: (option: TngChartOption, opts?: TngChartSetOptionOptions) => void;
  showLoading?: () => void;
}>;

export type TngChartRuntime = Readonly<{
  init: (
    element: unknown,
    theme?: TngChartTheme,
    opts?: TngChartInitOptions,
  ) => TngChartInstance;
  use?: (extensions: readonly unknown[]) => void;
}>;

export type { TngChartPointEvent } from './chart-event.types';
export type { TngChartSeries } from './chart-series.types';
