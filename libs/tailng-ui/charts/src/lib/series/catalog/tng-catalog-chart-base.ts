import { booleanAttribute, computed, Directive, input, output } from '@angular/core';
import type { TngCatalogChartPreset } from './catalog-chart.types';
import { createTngCatalogChartOption } from './catalog-option.factory';
import type {
  TngChartData,
  TngChartHeight,
  TngChartOption,
  TngChartOptionOverride,
  TngChartPointEvent,
  TngChartRenderer,
  TngChartRuntimeLoader,
  TngChartSeries,
  TngChartTheme,
} from '../../core/chart.types';

@Directive()
export abstract class TngCatalogChartComponentBase {
  protected abstract readonly preset: TngCatalogChartPreset;

  public readonly categoryField = input<string | null>(null);
  public readonly data = input.required<TngChartData>();
  public readonly height = input<TngChartHeight>(320);
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
  public readonly renderer = input<TngChartRenderer>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly series = input<readonly TngChartSeries[] | null>(null);
  public readonly sourceField = input<string | null>(null);
  public readonly targetField = input<string | null>(null);
  public readonly theme = input<TngChartTheme>(null);
  public readonly tooltip = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly valueField = input<string | null>(null);
  public readonly xField = input<string | null>(null);
  public readonly yField = input<string | null>(null);

  public readonly chartReady = output<unknown>();
  public readonly pointClick = output<TngChartPointEvent>();
  public readonly pointHover = output<TngChartPointEvent>();
  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly option = computed<TngChartOption>(() =>
    createTngCatalogChartOption(
      {
        categoryField: this.categoryField(),
        data: this.data(),
        legend: this.legend(),
        nameField: this.nameField(),
        optionOverride: this.optionOverride(),
        series: this.series(),
        sourceField: this.sourceField(),
        targetField: this.targetField(),
        tooltip: this.tooltip(),
        valueField: this.valueField(),
        xField: this.xField(),
        yField: this.yField(),
      },
      this.preset,
    ),
  );
}
