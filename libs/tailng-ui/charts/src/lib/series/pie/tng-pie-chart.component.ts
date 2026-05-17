import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import type { TngLegacyPieChartInput } from './pie-chart.types';
import { createTngPieChartOption, isTngLegacyPieChartInput } from './pie-option.factory';
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
import {
  getTngChartStringValue,
} from '../../core/chart.utils';

@Component({
  selector: 'tng-pie-chart',
  imports: [
    TngChartRootComponent,
    TngChartSurfaceComponent,
    TngChartEmptyStateComponent,
    TngChartLegendComponent,
    TngChartLoadingStateComponent,
  ],
  templateUrl: './tng-pie-chart.component.html',
  styleUrl: './tng-pie-chart.component.css',
})
export class TngPieChartComponent {
  public readonly data = input.required<TngChartData | TngLegacyPieChartInput>();
  public readonly donut = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly emptyMessage = input('No chart data available.');
  public readonly height = input<number | string>(320);
  public readonly innerRadius = input<string | number>('45%');
  public readonly legend = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly merge = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly nameField = input<string | null>(null);
  public readonly optionOverride = input<TngChartOptionOverride | null>(null);
  public readonly outerRadius = input<string | number>('70%');
  public readonly renderer = input<TngChartRenderer>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly theme = input<TngChartTheme>(null);
  public readonly tooltip = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly valueField = input<string | null>(null);

  public readonly chartReady = output<unknown>();
  public readonly pointClick = output<TngChartPointEvent>();
  public readonly pointHover = output<TngChartPointEvent>();
  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly isEmpty = computed<boolean>(() => {
    const data = this.data();
    return isTngLegacyPieChartInput(data) ? data.data.length === 0 : data.length === 0;
  });
  protected readonly legendItems = computed<readonly TngChartLegendItem[]>(() => {
    const data = this.data();
    if (isTngLegacyPieChartInput(data)) {
      return data.data.map((slice, index) => ({
        color:
          slice.color ??
          TNG_CHART_DEFAULT_THEME.palette[index % TNG_CHART_DEFAULT_THEME.palette.length] ??
          null,
        key: slice.name,
        label: slice.name,
      }));
    }

    const nameField = this.nameField() ?? '';
    return data.map((datum, index) => {
      const label = getTngChartStringValue(datum, nameField);
      return {
        color: TNG_CHART_DEFAULT_THEME.palette[index % TNG_CHART_DEFAULT_THEME.palette.length] ?? null,
        disabled: true,
        key: label,
        label,
      };
    });
  });
  protected readonly optionFactory = computed<TngChartOptionFactory>(() => {
    const data = this.data();
    if (isTngLegacyPieChartInput(data)) {
      return (): TngChartOption => createTngPieChartOption(data);
    }

    const donut = this.donut();
    const innerRadius = this.innerRadius();
    const legend = this.legend();
    const nameField = this.nameField() ?? '';
    const optionOverride = this.optionOverride();
    const outerRadius = this.outerRadius();
    const tooltip = this.tooltip();
    const valueField = this.valueField() ?? '';

    return (): TngChartOption =>
      createTngPieChartOption({
        data,
        donut,
        innerRadius,
        legend,
        nameField,
        optionOverride,
        outerRadius,
        tooltip,
        valueField,
      });
  });
}
