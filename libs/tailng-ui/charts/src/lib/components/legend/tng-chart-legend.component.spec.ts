import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { TngChartLegendComponent } from './tng-chart-legend.component';
import { TNG_CHART_CONTEXT } from '../../core/chart-context';
import type { TngChartContext } from '../../core/chart-context';
import type { TngChartLegendItem } from '../../core/chart-series.types';
import { TngChartRootComponent } from '../chart-root/tng-chart-root.component';

@Component({
  selector: 'tng-legend-context-probe',
  template: '',
})
class LegendContextProbeComponent {
  public readonly context = inject(TNG_CHART_CONTEXT);
}

@Component({
  imports: [LegendContextProbeComponent, TngChartLegendComponent, TngChartRootComponent],
  template: `
    <tng-chart-root [legendItems]="legendItems">
      <tng-chart-legend />
      <tng-legend-context-probe />
    </tng-chart-root>
  `,
})
class LegendContextHostComponent {
  public readonly legendItems: readonly TngChartLegendItem[] = [
    {
      color: '#2563eb',
      key: 'revenue',
      label: 'Revenue',
    },
  ];
}

describe('tng-chart-legend component', () => {
  it('exports the legend component', () => {
    expect(typeof TngChartLegendComponent).toBe('function');
  });

  it('toggles visible series through chart context', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LegendContextHostComponent],
    }).createComponent(LegendContextHostComponent);

    fixture.detectChanges();

    const context: TngChartContext = (
      fixture.debugElement.query(By.directive(LegendContextProbeComponent))
        .componentInstance as LegendContextProbeComponent
    ).context;
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;

    expect(button).not.toBeNull();
    expect(context.legendItems()[0]?.hidden).toBe(false);

    button?.click();
    fixture.detectChanges();

    expect(context.legendItems()[0]?.hidden).toBe(true);
  });
});
