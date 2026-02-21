export type TngChartOption = Readonly<Record<string, unknown>>;

export type TngChartTheme = Readonly<Record<string, unknown>> | string | null;

export type TngChartRenderer = 'canvas' | 'svg';

export type TngChartRuntimeLoader = () => Promise<unknown>;

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
  resize: () => void;
  setOption: (option: TngChartOption, opts?: TngChartSetOptionOptions) => void;
  showLoading?: () => void;
}>;

export type TngChartRuntime = Readonly<{
  init: (
    element: HTMLElement,
    theme?: TngChartTheme,
    opts?: TngChartInitOptions,
  ) => TngChartInstance;
}>;
