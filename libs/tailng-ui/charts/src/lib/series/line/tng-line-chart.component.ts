import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { createTngLineChartOption } from './line.option-builder';
import type { TngLineChartInput } from './line.types';
import type { TngChartRenderer, TngChartRuntimeLoader, TngChartTheme } from '../../chart.types';
import { TngChartComponent } from '../../tng-chart.component';

@Component({
  selector: 'tng-line-chart',
  imports: [TngChartComponent],
  templateUrl: './tng-line-chart.component.html',
  styleUrl: './tng-line-chart.component.css',
})
export class TngLineChartComponent {
  public readonly data = input.required<TngLineChartInput>();
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
    return createTngLineChartOption(this.data());
  });
}
