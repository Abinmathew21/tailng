import { Component, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { TngChartRootComponent } from './tng-chart-root.component';
import { TNG_CHART_CONTEXT } from '../../core/chart-context';
import type { TngChartContext, TngChartOptionFactory } from '../../core/chart-context';
import type { TngChartLegendItem } from '../../core/chart-series.types';
import type { TngChartOption } from '../../core/chart.types';

@Component({
  selector: 'tng-chart-context-probe',
  template: '',
})
class ChartContextProbeComponent {
  public readonly context = inject(TNG_CHART_CONTEXT);
}

@Component({
  imports: [ChartContextProbeComponent, TngChartRootComponent],
  template: `
    <tng-chart-root [legendItems]="legendItems()" [optionFactory]="optionFactory">
      <tng-chart-context-probe />
    </tng-chart-root>
  `,
})
class ChartRootHostComponent {
  public readonly legendItems = signal<readonly TngChartLegendItem[]>([
    {
      color: '#2563eb',
      key: 'revenue',
      label: 'Revenue',
    },
  ]);

  public readonly optionFactory: TngChartOptionFactory = (
    hiddenSeries: ReadonlySet<string>,
  ): TngChartOption => ({
    hiddenSeries: [...hiddenSeries],
  });
}

function getContextProbe(
  fixture: ComponentFixture<ChartRootHostComponent>,
): ChartContextProbeComponent {
  return fixture.debugElement.query(By.directive(ChartContextProbeComponent))
    .componentInstance as ChartContextProbeComponent;
}

describe('tng-chart-root component', () => {
  it('exports the chart root component', () => {
    expect(typeof TngChartRootComponent).toBe('function');
  });

  it('exports the chart context token', () => {
    expect(String(TNG_CHART_CONTEXT)).toContain('TNG_CHART_CONTEXT');
  });

  it('provides computed legend items and generated option through context', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChartRootHostComponent],
    }).createComponent(ChartRootHostComponent);

    fixture.detectChanges();

    const context: TngChartContext = getContextProbe(fixture).context;

    expect(context.legendItems()[0]).toMatchObject({
      hidden: false,
      key: 'revenue',
      label: 'Revenue',
    });
    expect(context.option()).toEqual({
      hiddenSeries: [],
    });

    context.toggleSeries('revenue');
    fixture.detectChanges();

    expect(context.legendItems()[0]).toMatchObject({
      hidden: true,
      key: 'revenue',
    });
    expect(context.option()).toEqual({
      hiddenSeries: ['revenue'],
    });
  });
});
