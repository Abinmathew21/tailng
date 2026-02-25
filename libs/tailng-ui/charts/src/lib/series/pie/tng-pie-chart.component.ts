import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { createTngPieChartOption } from './pie.option-builder';
import type { TngPieChartInput } from './pie.types';
import type { TngChartRenderer, TngChartRuntimeLoader, TngChartTheme } from '../../chart.types';
import { TngChartComponent } from '../../tng-chart.component';

@Component({
  selector: 'tng-pie-chart',
  imports: [TngChartComponent],
  templateUrl: './tng-pie-chart.component.html',
  styleUrl: './tng-pie-chart.component.css',
})
export class TngPieChartComponent {
  public readonly data = input.required<TngPieChartInput>();
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
    return createTngPieChartOption(this.data());
  });
}
