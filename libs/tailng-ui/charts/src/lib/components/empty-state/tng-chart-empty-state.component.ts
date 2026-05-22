import { Component, input } from '@angular/core';
import { resolveTngChartHeight } from '../../core/chart.utils';

@Component({
  selector: 'tng-chart-empty-state',
  templateUrl: './tng-chart-empty-state.component.html',
  styleUrl: './tng-chart-empty-state.component.css',
  host: {
    '[style.height]': 'heightStyle()',
  },
})
export class TngChartEmptyStateComponent {
  public readonly height = input<number | string>(320);
  public readonly message = input('No chart data available.');

  protected heightStyle(): string {
    return resolveTngChartHeight(this.height());
  }
}
