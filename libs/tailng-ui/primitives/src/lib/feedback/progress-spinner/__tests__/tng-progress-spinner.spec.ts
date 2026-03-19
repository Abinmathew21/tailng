import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  resolveTngProgressSpinnerRange,
  TngProgressSpinner,
} from '../tng-progress-spinner';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

@Component({
  imports: [TngProgressSpinner],
  template: `
    <span
      tngProgressSpinner
      data-testid="progress-spinner"
      [indeterminate]="indeterminate()"
      [max]="max()"
      [min]="min()"
      [value]="value()"
    ></span>
  `,
})
class ProgressSpinnerPrimitivesHostComponent {
  public readonly indeterminate = signal(false);
  public readonly max = signal(100);
  public readonly min = signal(0);
  public readonly value = signal(0);
}

describe('tng-progress-spinner primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngProgressSpinner symbol', () => {
    expect(typeof TngProgressSpinner).toBe('function');
  });

  it('normalizes and clamps progress range values', () => {
    expect(resolveTngProgressSpinnerRange(0, 100, 24)).toEqual({
      max: 100,
      min: 0,
      value: 24,
    });
    expect(resolveTngProgressSpinnerRange(80, 20, 120)).toEqual({
      max: 80,
      min: 80,
      value: 80,
    });
    expect(resolveTngProgressSpinnerRange(Number.NaN, Number.NaN, Number.NaN)).toEqual({
      max: 100,
      min: 0,
      value: 0,
    });
  });

  it('applies role and aria range attributes for determinate state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressSpinnerPrimitivesHostComponent],
    }).createComponent(ProgressSpinnerPrimitivesHostComponent);
    fixture.componentInstance.min.set(10);
    fixture.componentInstance.max.set(210);
    fixture.componentInstance.value.set(85);
    fixture.detectChanges();

    const progressSpinner = getByTestId<HTMLElement>(fixture, 'progress-spinner');
    expect(progressSpinner.getAttribute('data-slot')).toBe('progress-spinner');
    expect(progressSpinner.getAttribute('role')).toBe('progressbar');
    expect(progressSpinner.getAttribute('aria-valuemin')).toBe('10');
    expect(progressSpinner.getAttribute('aria-valuemax')).toBe('210');
    expect(progressSpinner.getAttribute('aria-valuenow')).toBe('85');
    expect(progressSpinner.hasAttribute('data-indeterminate')).toBe(false);
  });

  it('clamps invalid range/value combinations to a safe progress range', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressSpinnerPrimitivesHostComponent],
    }).createComponent(ProgressSpinnerPrimitivesHostComponent);
    fixture.componentInstance.min.set(80);
    fixture.componentInstance.max.set(20);
    fixture.componentInstance.value.set(120);
    fixture.detectChanges();

    const progressSpinner = getByTestId<HTMLElement>(fixture, 'progress-spinner');
    expect(progressSpinner.getAttribute('aria-valuemin')).toBe('80');
    expect(progressSpinner.getAttribute('aria-valuemax')).toBe('80');
    expect(progressSpinner.getAttribute('aria-valuenow')).toBe('80');
  });

  it('removes aria range attributes and exposes indeterminate hook when indeterminate=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressSpinnerPrimitivesHostComponent],
    }).createComponent(ProgressSpinnerPrimitivesHostComponent);
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    const progressSpinner = getByTestId<HTMLElement>(fixture, 'progress-spinner');
    expect(progressSpinner.getAttribute('role')).toBe('progressbar');
    expect(progressSpinner.getAttribute('aria-valuemin')).toBeNull();
    expect(progressSpinner.getAttribute('aria-valuemax')).toBeNull();
    expect(progressSpinner.getAttribute('aria-valuenow')).toBeNull();
    expect(progressSpinner.hasAttribute('data-indeterminate')).toBe(true);
  });
});
