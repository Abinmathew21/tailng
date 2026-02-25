import {
  booleanAttribute,
  Component,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import type {
  TngChartInitOptions,
  TngChartInstance,
  TngChartOption,
  TngChartRenderer,
  TngChartRuntime,
  TngChartRuntimeLoader,
  TngChartTheme,
} from './chart.types';
import { loadTngEchartsRuntime } from './echarts.loader';

export function resolveTngChartRenderer(renderer: string): TngChartRenderer {
  return renderer === 'svg' ? 'svg' : 'canvas';
}

export function resolveTngChartNotMerge(merge: boolean): boolean {
  return !merge;
}

export function shouldAttachTngChartResizeObserver(
  autoResize: boolean,
  hasResizeObserverApi: boolean,
): boolean {
  return autoResize && hasResizeObserverApi;
}

@Component({
  selector: 'tng-chart',
  templateUrl: './tng-chart.component.html',
  styleUrl: './tng-chart.component.css',
})
export class TngChartComponent implements AfterViewInit, OnDestroy {
  public readonly autoResize = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly lazyUpdate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly merge = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly option = input<TngChartOption | null>(null);
  public readonly renderer = input<string>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly theme = input<TngChartTheme>(null);

  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  private readonly hostRef = viewChild<ElementRef<HTMLElement>>('hostRef');
  private chart: TngChartInstance | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly hasResizeObserverApi = typeof ResizeObserver !== 'undefined';

  private readonly syncOptionEffect = effect((): void => {
    const option = this.option();
    const merge = this.merge();
    const lazyUpdate = this.lazyUpdate();
    this.applyOption(option, merge, lazyUpdate);
  });

  private readonly syncLoadingEffect = effect((): void => {
    this.setLoading(this.loading());
  });

  private readonly syncResizeEffect = effect((): void => {
    this.updateResizeObservation(this.autoResize());
  });

  public ngAfterViewInit(): void {
    void this.initializeChart();
  }

  private async initializeChart(): Promise<void> {
    const hostElement = this.hostRef()?.nativeElement;
    if (hostElement === undefined) {
      return;
    }

    try {
      const runtime = await loadTngEchartsRuntime(this.runtimeLoader());
      this.chart = this.initChart(runtime);
      this.applyOption(this.option(), this.merge(), this.lazyUpdate());
      this.setLoading(this.loading());
      this.updateResizeObservation(this.autoResize());
      this.ready.emit();
    } catch (error: unknown) {
      this.runtimeError.emit(this.toErrorMessage(error));
    }
  }

  public ngOnDestroy(): void {
    this.syncOptionEffect.destroy();
    this.syncLoadingEffect.destroy();
    this.syncResizeEffect.destroy();
    this.disconnectResizeObserver();
    this.disposeChart();
  }

  private applyOption(
    option: TngChartOption | null,
    merge: boolean,
    lazyUpdate: boolean,
  ): void {
    if (this.chart === null || option === null) {
      return;
    }

    this.chart.setOption(option, {
      lazyUpdate,
      notMerge: resolveTngChartNotMerge(merge),
    });
  }

  private disconnectResizeObserver(): void {
    if (this.resizeObserver === null) {
      return;
    }

    this.resizeObserver.disconnect();
    this.resizeObserver = null;
  }

  private disposeChart(): void {
    if (this.chart === null) {
      return;
    }

    this.chart.dispose();
    this.chart = null;
  }

  private initChart(runtime: TngChartRuntime): TngChartInstance {
    const hostElement = this.hostRef()?.nativeElement;
    if (hostElement === undefined) {
      throw new Error('Chart host element is not available.');
    }

    const initOptions: TngChartInitOptions = {
      renderer: resolveTngChartRenderer(this.renderer()),
    };
    return runtime.init(hostElement, this.theme(), initOptions);
  }

  private setLoading(loading: Readonly<boolean>): void {
    if (this.chart === null) {
      return;
    }

    if (loading) {
      this.chart.showLoading?.();
      return;
    }

    this.chart.hideLoading?.();
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown ECharts runtime error.';
  }

  private updateResizeObservation(autoResize: boolean): void {
    if (!shouldAttachTngChartResizeObserver(autoResize, this.hasResizeObserverApi)) {
      this.disconnectResizeObserver();
      return;
    }

    const chart = this.chart;
    const hostElement = this.hostRef()?.nativeElement;
    if (chart === null || hostElement === undefined) {
      return;
    }

    this.resizeObserver ??= new ResizeObserver((): void => {
      chart.resize();
    });

    this.resizeObserver.disconnect();
    this.resizeObserver.observe(hostElement);
  }
}
