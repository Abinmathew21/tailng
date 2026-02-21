export type TngChartOption = Readonly<Record<string, unknown>>;

export type TngChartTheme = Readonly<Record<string, unknown>> | string | null;

export type TngChartRenderer = 'canvas' | 'svg';

export type TngEchartsModuleLoader = () => Promise<unknown>;

export type TngEchartSetOptionOptions = Readonly<{
  lazyUpdate?: boolean;
  notMerge?: boolean;
}>;

export type TngEchartInitOptions = Readonly<{
  renderer?: TngChartRenderer;
}>;

export type TngEchartInstance = Readonly<{
  dispose: () => void;
  hideLoading?: () => void;
  resize: () => void;
  setOption: (option: TngChartOption, opts?: TngEchartSetOptionOptions) => void;
  showLoading?: () => void;
}>;

export type TngEchartsModule = Readonly<{
  init: (
    element: HTMLElement,
    theme?: TngChartTheme,
    opts?: TngEchartInitOptions,
  ) => TngEchartInstance;
}>;
