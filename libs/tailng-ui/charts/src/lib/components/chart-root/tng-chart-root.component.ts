import { booleanAttribute, Component, computed, forwardRef, input, signal } from '@angular/core';
import { TNG_CHART_CONTEXT } from '../../core/chart-context';
import type { TngChartContext, TngChartOptionFactory } from '../../core/chart-context';
import type { TngChartLegendItem } from '../../core/chart-series.types';
import type {
  TngChartHeight,
  TngChartOption,
  TngChartRenderer,
  TngChartRuntimeLoader,
  TngChartTheme,
} from '../../core/chart.types';

@Component({
  selector: 'tng-chart-root',
  templateUrl: './tng-chart-root.component.html',
  styleUrl: './tng-chart-root.component.css',
  providers: [
    {
      provide: TNG_CHART_CONTEXT,
      useFactory: (root: TngChartRootComponent): TngChartContext => root.context,
      deps: [forwardRef(() => TngChartRootComponent)],
    },
  ],
})
export class TngChartRootComponent {
  public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  public readonly autoResize = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly height = input<TngChartHeight>(320);
  public readonly lazyUpdate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly legendItems = input<readonly TngChartLegendItem[]>([]);
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly merge = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly option = input<TngChartOption | null>(null);
  public readonly optionFactory = input<TngChartOptionFactory | null>(null);
  public readonly renderer = input<TngChartRenderer>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly theme = input<TngChartTheme>(null);

  private readonly hiddenSeriesKeys = signal<readonly string[]>([]);

  public readonly hiddenSeries = computed<ReadonlySet<string>>(
    () => new Set(this.hiddenSeriesKeys()),
  );
  public readonly resolvedLegendItems = computed<readonly TngChartLegendItem[]>(() => {
    const hiddenSeries = this.hiddenSeries();

    return this.legendItems().map((item) => ({
      ...item,
      hidden: item.hidden === true || hiddenSeries.has(item.key),
    }));
  });
  public readonly resolvedOption = computed<TngChartOption | null>(() => {
    const optionFactory = this.optionFactory();
    return optionFactory === null ? this.option() : optionFactory(this.hiddenSeries());
  });

  public readonly isSeriesVisible = (seriesKey: string): boolean => !this.hiddenSeries().has(seriesKey);

  public readonly setSeriesVisible = (seriesKey: string, visible: boolean): void => {
    const hiddenSeries = new Set(this.hiddenSeriesKeys());

    if (visible) {
      hiddenSeries.delete(seriesKey);
    } else {
      hiddenSeries.add(seriesKey);
    }

    this.hiddenSeriesKeys.set([...hiddenSeries]);
  };

  public readonly toggleSeries = (seriesKey: string): void => {
    this.setSeriesVisible(seriesKey, !this.isSeriesVisible(seriesKey));
  };

  public readonly context: TngChartContext = {
    ariaLabel: this.ariaLabel,
    ariaLabelledby: this.ariaLabelledby,
    autoResize: this.autoResize,
    height: this.height,
    hiddenSeries: this.hiddenSeries,
    isSeriesVisible: this.isSeriesVisible,
    lazyUpdate: this.lazyUpdate,
    legendItems: this.resolvedLegendItems,
    loading: this.loading,
    merge: this.merge,
    option: this.resolvedOption,
    renderer: this.renderer,
    runtimeLoader: this.runtimeLoader,
    setSeriesVisible: this.setSeriesVisible,
    theme: this.theme,
    toggleSeries: this.toggleSeries,
  };
}
