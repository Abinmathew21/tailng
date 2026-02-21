import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { TNG_BAR_CHART_DEFAULT_KIND } from './bar.defaults';
import { createTngBarChartOption } from './bar.option-builder';
import type { TngBarChartInput, TngBarChartKind } from './bar.types';
import type { TngChartRenderer, TngChartRuntimeLoader, TngChartTheme } from '../../chart.types';
import { TngChart } from '../../tng-chart.component';

@Component({
  selector: 'tng-bar-chart',
  imports: [TngChart],
  templateUrl: './tng-bar-chart.component.html',
  styleUrl: './tng-bar-chart.component.css',
})
export class TngBarChart {
  public readonly data = input.required<TngBarChartInput>();
  public readonly kind = input<TngBarChartKind>(TNG_BAR_CHART_DEFAULT_KIND);
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly merge = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly renderer = input<TngChartRenderer>('canvas');
  public readonly runtimeLoader = input<TngChartRuntimeLoader | null>(null);
  public readonly theme = input<TngChartTheme>(null);

  public readonly ready = output<void>();
  public readonly runtimeError = output<string>();

  protected readonly option = computed<Readonly<Record<string, unknown>>>(() => {
    return createTngBarChartOption(this.data(), this.kind());
  });
}
