import type { TngChartOption, TngChartRuntime } from '../core/chart.types';

export type TngEchartsRuntime = TngChartRuntime;

export type TngEchartsOption = TngChartOption;

export type TngEchartsEventName = 'click' | 'mouseover';

export type TngEchartsEventHandler = (event: unknown) => void;
