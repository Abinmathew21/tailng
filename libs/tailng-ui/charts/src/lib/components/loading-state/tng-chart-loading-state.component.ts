import { Component, input } from '@angular/core';
import { resolveTngChartHeight } from '../../core/chart.utils';

@Component({
  selector: 'tng-chart-loading-state',
  templateUrl: './tng-chart-loading-state.component.html',
  styleUrl: './tng-chart-loading-state.component.css',
  host: {
    '[style.height]': 'heightStyle()',
  },
})
export class TngChartLoadingStateComponent {
  public readonly height = input<number | string>(320);
  public readonly message = input('Loading chart data...');

  protected heightStyle(): string {
    return resolveTngChartHeight(this.height());
  }
}
