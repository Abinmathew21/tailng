import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { createTngAreaChartOption } from './area-option.factory';
import { TngChartRootComponent } from '../../components/chart-root/tng-chart-root.component';
import { TngChartSurfaceComponent } from '../../components/chart-surface/tng-chart-surface.component';
import { TngChartEmptyStateComponent } from '../../components/empty-state/tng-chart-empty-state.component';
import { TngChartLegendComponent } from '../../components/legend/tng-chart-legend.component';
import { TngChartLoadingStateComponent } from '../../components/loading-state/tng-chart-loading-state.component';
import type { TngChartOptionFactory } from '../../core/chart-context';
import type { TngChartLegendItem, TngChartSeries } from '../../core/chart-series.types';
import { TNG_CHART_DEFAULT_THEME } from '../../core/chart.tokens';
import type {
  TngChartData,
  TngChartOption,
  TngChartOptionOverride,
  TngChartPointEvent,
  TngChartRenderer,
  TngChartRuntimeLoader,
  TngChartTheme,
} from '../../core/chart.types';
import {
  createTngChartLegendItems,
  createTngChartSeriesFromField,
} from '../../core/chart.utils';

@Component({
  selector: 'tng-area-chart',
  imports: [
    TngChartRootComponent,
    TngChartSurfaceComponent,
    TngChartEmptyStateComponent,
    TngChartLegendComponent,
    TngChartLoadingStateComponent,
  ],
  templateUrl: './tng-area-chart.component.html',
  styleUrl: './tng-area-chart.component.css',
})
export class TngAreaChartComponent {
  public readonly data = input.required<TngChartData>();
  public readonly emptyMessage = input('No chart data available.');
  public readonly height = input<number | string>(320);
  public readonly legend = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly merge = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly optionOverride = input<TngChartOptionOverride | null>(null);
  public readonly renderer = input<TngChartRenderer>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly series = input<readonly TngChartSeries[] | null>(null);
  public readonly smooth = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly stacked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly theme = input<TngChartTheme>(null);
  public readonly tooltip = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly xField = input.required<string>();
  public readonly yField = input<string | null>(null);

  public readonly chartReady = output<unknown>();
  public readonly pointClick = output<TngChartPointEvent>();
  public readonly pointHover = output<TngChartPointEvent>();
  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly isEmpty = computed<boolean>(() => this.data().length === 0);
  protected readonly legendItems = computed<readonly TngChartLegendItem[]>(() =>
    createTngChartLegendItems(
      createTngChartSeriesFromField(this.yField(), this.series()),
      TNG_CHART_DEFAULT_THEME.palette,
      new Set<string>(),
    ),
  );
  protected readonly optionFactory = computed<TngChartOptionFactory>(() => {
    const data = this.data();
    const legend = this.legend();
    const optionOverride = this.optionOverride();
    const series = this.series();
    const smooth = this.smooth();
    const stacked = this.stacked();
    const tooltip = this.tooltip();
    const xField = this.xField();
    const yField = this.yField();

    return (hiddenSeries: ReadonlySet<string>): TngChartOption =>
      createTngAreaChartOption({
        data,
        hiddenSeries,
        legend,
        optionOverride,
        series,
        smooth,
        stacked,
        tooltip,
        xField,
        yField,
      });
  });
}
