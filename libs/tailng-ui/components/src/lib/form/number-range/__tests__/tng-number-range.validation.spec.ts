import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { TngNumberRangeValue } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Hosts ────────────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue()"
      [min]="minBound()"
      [max]="maxBound()"
      [invalid]="externalInvalid()"
    />
  `,
})
class ValidationHostComponent {
  public rangeValue = signal<TngNumberRangeValue>({
    min: null,
    max: null,
  });

  public minBound = signal<number | null>(null);
  public maxBound = signal<number | null>(null);
  public externalInvalid = signal(false);
}

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue()"
      [min]="minBound()"
      [max]="maxBound()"
      [invalid]="externalInvalid()"
      (valueChange)="rangeValue.set($event)"
    />
  `,
})
class SyncedValidationHostComponent {
  public rangeValue = signal<TngNumberRangeValue>({
    min: null,
    max: null,
  });

  public minBound = signal<number | null>(null);
  public maxBound = signal<number | null>(null);
  public externalInvalid = signal(false);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function setup(): ComponentFixture<ValidationHostComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [ValidationHostComponent],
  }).createComponent(ValidationHostComponent);

  fixture.detectChanges();

  return fixture;
}

function setupSynced(): ComponentFixture<SyncedValidationHostComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [SyncedValidationHostComponent],
  }).createComponent(SyncedValidationHostComponent);

  fixture.detectChanges();

  return fixture;
}

function getNativeElement<T>(fixture: ComponentFixture<T>): HTMLElement {
  return fixture.debugElement.nativeElement as unknown as HTMLElement;
}

function getGroupFromFixture<T>(fixture: ComponentFixture<T>): HTMLElement {
  return getNativeElement(fixture).querySelector('.tng-number-range')!;
}

function getMinInputFromFixture<T>(
  fixture: ComponentFixture<T>,
): HTMLInputElement {
  return getNativeElement(fixture).querySelector(
    '.tng-number-range__input--min',
  )!;
}

function getMaxInputFromFixture<T>(
  fixture: ComponentFixture<T>,
): HTMLInputElement {
  return getNativeElement(fixture).querySelector(
    '.tng-number-range__input--max',
  )!;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: Validation - range order', () => {
  it('should be valid when both values are null', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: null, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be valid when only min is set', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 10, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be valid when only max is set', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: null, max: 100 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be valid when min is less than max', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be valid when min equals max', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 50, max: 50 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be invalid when min is greater than max', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });

  it('should become valid again when min is corrected below max', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );

    fixture.componentInstance.rangeValue.set({ min: 5, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should become valid again when max is corrected above min', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );

    fixture.componentInstance.rangeValue.set({ min: 100, max: 200 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should become valid when min is cleared from an invalid range', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );

    fixture.componentInstance.rangeValue.set({ min: null, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should become valid when max is cleared from an invalid range', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );

    fixture.componentInstance.rangeValue.set({ min: 100, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should not prevent typing a min value greater than max', () => {
    const fixture = setupSynced();
  
    fixture.componentInstance.rangeValue.set({ min: null, max: 10 });
    fixture.detectChanges();
  
    dispatchInput(getMinInputFromFixture(fixture), '100');
    fixture.detectChanges();
  
    expect(getMinInputFromFixture(fixture).value).toBe('100');
    expect(fixture.componentInstance.rangeValue()).toEqual({
      min: 100,
      max: 10,
    });
    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(true);
  });

  it('should not prevent typing a max value less than min', () => {
    const fixture = setupSynced();
  
    fixture.componentInstance.rangeValue.set({ min: 100, max: null });
    fixture.detectChanges();
  
    dispatchInput(getMaxInputFromFixture(fixture), '10');
    fixture.detectChanges();
  
    expect(getMaxInputFromFixture(fixture).value).toBe('10');
    expect(fixture.componentInstance.rangeValue()).toEqual({
      min: 100,
      max: 10,
    });
    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(true);
  });
});

describe('tng-number-range: Validation - configured boundaries', () => {
  it('should be valid when min value equals configured lower boundary', () => {
    const fixture = setup();

    fixture.componentInstance.minBound.set(0);
    fixture.componentInstance.rangeValue.set({ min: 0, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be valid when min value is greater than configured lower boundary', () => {
    const fixture = setup();

    fixture.componentInstance.minBound.set(0);
    fixture.componentInstance.rangeValue.set({ min: 5, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be invalid when min value is less than configured lower boundary', () => {
    const fixture = setup();

    fixture.componentInstance.minBound.set(0);
    fixture.componentInstance.rangeValue.set({ min: -1, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });

  it('should be valid when max value equals configured upper boundary', () => {
    const fixture = setup();

    fixture.componentInstance.maxBound.set(100);
    fixture.componentInstance.rangeValue.set({ min: null, max: 100 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be valid when max value is less than configured upper boundary', () => {
    const fixture = setup();

    fixture.componentInstance.maxBound.set(100);
    fixture.componentInstance.rangeValue.set({ min: null, max: 90 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should be invalid when max value is greater than configured upper boundary', () => {
    const fixture = setup();

    fixture.componentInstance.maxBound.set(100);
    fixture.componentInstance.rangeValue.set({ min: null, max: 110 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });

  it('should become valid when out-of-bound min is corrected', () => {
    const fixture = setup();

    fixture.componentInstance.minBound.set(0);
    fixture.componentInstance.rangeValue.set({ min: -5, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );

    fixture.componentInstance.rangeValue.set({ min: 1, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should become valid when out-of-bound max is corrected', () => {
    const fixture = setup();

    fixture.componentInstance.maxBound.set(100);
    fixture.componentInstance.rangeValue.set({ min: null, max: 200 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );

    fixture.componentInstance.rangeValue.set({ min: null, max: 50 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should allow null min even when lower boundary is configured', () => {
    const fixture = setup();

    fixture.componentInstance.minBound.set(0);
    fixture.componentInstance.rangeValue.set({ min: null, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should allow null max even when upper boundary is configured', () => {
    const fixture = setup();

    fixture.componentInstance.maxBound.set(100);
    fixture.componentInstance.rangeValue.set({ min: null, max: null });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should recalculate validity when configured lower boundary changes', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 5, max: null });
    fixture.componentInstance.minBound.set(0);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );

    fixture.componentInstance.minBound.set(10);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });

  it('should recalculate validity when configured upper boundary changes', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: null, max: 80 });
    fixture.componentInstance.maxBound.set(100);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );

    fixture.componentInstance.maxBound.set(50);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });
});

describe('tng-number-range: External invalid state', () => {
  it('should be invalid when external invalid input is true', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });

  it('should be valid when external invalid input is false and internal validation passes', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(false);
    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should reflect invalid state on root when external invalid is true', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).getAttribute('data-invalid')).toBe('');
  });

  it('should reflect invalid state on min input when external invalid is true', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('should reflect invalid state on max input when external invalid is true', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('should combine external invalid state with internal range-order invalid state', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.componentInstance.rangeValue.set({ min: 50, max: 100 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      true,
    );
  });
});