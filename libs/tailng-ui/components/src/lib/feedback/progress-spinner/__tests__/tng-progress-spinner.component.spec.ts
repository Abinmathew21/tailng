import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  toTngProgressSpinnerDashOffset,
  toTngProgressSpinnerPercent,
  TngProgressSpinnerComponent,
} from '../tng-progress-spinner.component';

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

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!(element instanceof Element)) {
    throw new Error(`Expected selector "${selector}" to resolve.`);
  }

  return element as T;
}

@Component({
  standalone: true,
  imports: [TngProgressSpinnerComponent],
  template: `
    <tng-progress-spinner
      data-testid="spinner-host"
      [ariaLabel]="ariaLabel()"
      [indeterminate]="indeterminate()"
      [max]="max()"
      [min]="min()"
      [size]="size()"
      [strokeWidth]="strokeWidth()"
      [value]="value()"
    ></tng-progress-spinner>
  `,
})
class ProgressSpinnerComponentHostComponent {
  public readonly ariaLabel = signal<string | null>('Sync progress');
  public readonly indeterminate = signal(false);
  public readonly max = signal(100);
  public readonly min = signal(0);
  public readonly size = signal(40);
  public readonly strokeWidth = signal(4);
  public readonly value = signal(60);
}

describe('tng-progress-spinner component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngProgressSpinner symbol', () => {
    expect(typeof TngProgressSpinnerComponent).toBe('function');
  });

  it('maps values to determinate spinner metrics', () => {
    expect(toTngProgressSpinnerPercent(0, 100, 25)).toBe(25);
    expect(toTngProgressSpinnerPercent(20, 120, 70)).toBe(50);
    expect(toTngProgressSpinnerPercent(0, 0, 10)).toBe(100);
    expect(toTngProgressSpinnerDashOffset(0)).toBeGreaterThan(0);
    expect(toTngProgressSpinnerDashOffset(100)).toBe(0);
  });

  it('renders determinate progress semantics and stroke offset', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressSpinnerComponentHostComponent],
    }).createComponent(ProgressSpinnerComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'spinner-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-spinner"]');
    const indicator = getRequired<SVGCircleElement>(host, '.tng-progress-spinner-indicator');

    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-label')).toBe('Sync progress');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
    expect(root.getAttribute('aria-valuenow')).toBe('60');
    expect(root.style.getPropertyValue('--tng-progress-spinner-size')).toBe('40px');
    expect(root.style.getPropertyValue('--tng-progress-spinner-stroke-width')).toBe('4px');
    expect(indicator.getAttribute('stroke-dasharray')).not.toBeNull();
    expect(indicator.getAttribute('stroke-dashoffset')).not.toBeNull();
    expect(indicator.hasAttribute('data-indeterminate')).toBe(false);
  });

  it('switches to indeterminate mode without aria range values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressSpinnerComponentHostComponent],
    }).createComponent(ProgressSpinnerComponentHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'spinner-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-spinner"]');
    const indicator = getRequired<SVGCircleElement>(host, '.tng-progress-spinner-indicator');

    expect(root.getAttribute('aria-valuemin')).toBeNull();
    expect(root.getAttribute('aria-valuemax')).toBeNull();
    expect(root.getAttribute('aria-valuenow')).toBeNull();
    expect(root.hasAttribute('data-indeterminate')).toBe(true);
    expect(indicator.hasAttribute('data-indeterminate')).toBe(true);
    expect(indicator.getAttribute('stroke-dashoffset')).toBeNull();
  });

  it('recomputes clamped range output on runtime updates', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgressSpinnerComponentHostComponent],
    }).createComponent(ProgressSpinnerComponentHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.min.set(80);
    fixture.componentInstance.max.set(20);
    fixture.componentInstance.value.set(120);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'spinner-host');
    const root = getRequired<HTMLElement>(host, '[data-slot="progress-spinner"]');
    const indicator = getRequired<SVGCircleElement>(host, '.tng-progress-spinner-indicator');

    expect(root.getAttribute('aria-valuemin')).toBe('80');
    expect(root.getAttribute('aria-valuemax')).toBe('80');
    expect(root.getAttribute('aria-valuenow')).toBe('80');
    expect(indicator.getAttribute('stroke-dashoffset')).toBe('0');
  });
});
