import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { createTngHeatmapChartOption } from './heatmap-option.factory';
import { TngChartRootComponent } from '../../components/chart-root/tng-chart-root.component';
import { TngChartSurfaceComponent } from '../../components/chart-surface/tng-chart-surface.component';
import { TngChartEmptyStateComponent } from '../../components/empty-state/tng-chart-empty-state.component';
import { TngChartLegendComponent } from '../../components/legend/tng-chart-legend.component';
import { TngChartLoadingStateComponent } from '../../components/loading-state/tng-chart-loading-state.component';
import type { TngChartOptionFactory } from '../../core/chart-context';
import type { TngChartLegendItem } from '../../core/chart-series.types';
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

@Component({
  selector: 'tng-heatmap-chart',
  imports: [
    TngChartRootComponent,
    TngChartSurfaceComponent,
    TngChartEmptyStateComponent,
    TngChartLegendComponent,
    TngChartLoadingStateComponent,
  ],
  templateUrl: './tng-heatmap-chart.component.html',
  styleUrl: './tng-heatmap-chart.component.css',
})
export class TngHeatmapChartComponent {
  public readonly data = input.required<TngChartData>();
  public readonly emptyMessage = input('No chart data available.');
  public readonly height = input<number | string>(360);
  public readonly legend = input<boolean, boolean | string>(false, {
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
  public readonly theme = input<TngChartTheme>(null);
  public readonly tooltip = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly valueField = input.required<string>();
  public readonly visualMap = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly xField = input.required<string>();
  public readonly yField = input.required<string>();

  public readonly chartReady = output<unknown>();
  public readonly pointClick = output<TngChartPointEvent>();
  public readonly pointHover = output<TngChartPointEvent>();
  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly isEmpty = computed<boolean>(() => this.data().length === 0);
  protected readonly legendItems = computed<readonly TngChartLegendItem[]>(() => [
    {
      color: TNG_CHART_DEFAULT_THEME.primaryColor,
      disabled: true,
      key: this.valueField(),
      label: this.valueField(),
    },
  ]);
  protected readonly optionFactory = computed<TngChartOptionFactory>(() => {
    const data = this.data();
    const legend = this.legend();
    const optionOverride = this.optionOverride();
    const tooltip = this.tooltip();
    const valueField = this.valueField();
    const visualMap = this.visualMap();
    const xField = this.xField();
    const yField = this.yField();

    return (): TngChartOption =>
      createTngHeatmapChartOption({
        data,
        legend,
        optionOverride,
        tooltip,
        valueField,
        visualMap,
        xField,
        yField,
      });
  });
}
