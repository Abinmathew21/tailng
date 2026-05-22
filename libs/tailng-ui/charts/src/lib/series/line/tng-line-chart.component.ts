import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import type { TngLegacyLineChartInput } from './line-chart.types';
import { createTngLineChartOption, isTngLegacyLineChartInput } from './line-option.factory';
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
  selector: 'tng-line-chart',
  imports: [
    TngChartRootComponent,
    TngChartSurfaceComponent,
    TngChartEmptyStateComponent,
    TngChartLegendComponent,
    TngChartLoadingStateComponent,
  ],
  templateUrl: './tng-line-chart.component.html',
  styleUrl: './tng-line-chart.component.css',
})
export class TngLineChartComponent {
  public readonly data = input.required<TngChartData | TngLegacyLineChartInput>();
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
  public readonly theme = input<TngChartTheme>(null);
  public readonly tooltip = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly xField = input<string | null>(null);
  public readonly yField = input<string | null>(null);

  public readonly chartReady = output<unknown>();
  public readonly pointClick = output<TngChartPointEvent>();
  public readonly pointHover = output<TngChartPointEvent>();
  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly isEmpty = computed<boolean>(() => {
    const data = this.data();
    return isTngLegacyLineChartInput(data)
      ? data.categories.length === 0 || data.series.length === 0
      : data.length === 0;
  });
  protected readonly legendItems = computed<readonly TngChartLegendItem[]>(() => {
    const data = this.data();

    if (isTngLegacyLineChartInput(data)) {
      return data.series.map((series, index) => ({
        color:
          series.color ??
          TNG_CHART_DEFAULT_THEME.palette[index % TNG_CHART_DEFAULT_THEME.palette.length] ??
          null,
        key: series.name,
        label: series.name,
      }));
    }

    return createTngChartLegendItems(
      createTngChartSeriesFromField(this.yField(), this.series()),
      TNG_CHART_DEFAULT_THEME.palette,
      new Set<string>(),
    );
  });
  protected readonly optionFactory = computed<TngChartOptionFactory>(() => {
    const data = this.data();
    if (isTngLegacyLineChartInput(data)) {
      return (): TngChartOption => createTngLineChartOption(data);
    }

    const legend = this.legend();
    const optionOverride = this.optionOverride();
    const series = this.series();
    const smooth = this.smooth();
    const tooltip = this.tooltip();
    const xField = this.xField() ?? '';
    const yField = this.yField();

    return (hiddenSeries: ReadonlySet<string>): TngChartOption =>
      createTngLineChartOption({
        data,
        hiddenSeries,
        legend,
        optionOverride,
        series,
        smooth,
        tooltip,
        xField,
        yField,
      });
  });
}
