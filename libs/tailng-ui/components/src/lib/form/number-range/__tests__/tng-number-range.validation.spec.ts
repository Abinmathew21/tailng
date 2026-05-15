import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import type { TngNumberRangeValue } from '@tailng-ui/primitives';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Hosts ────────────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue"
      [min]="minBound"
      [max]="maxBound"
      [invalid]="externalInvalid"
    />
  `,
})
class ValidationHostComponent {
  public rangeValue: TngNumberRangeValue = { min: null, max: null };
  public minBound: number | null = null;
  public maxBound: number | null = null;
  public externalInvalid = false;
}

function setup() {
  const fixture = TestBed.configureTestingModule({
    imports: [ValidationHostComponent],
  }).createComponent(ValidationHostComponent);
  fixture.detectChanges();
  return fixture;
}

function getGroup(el: HTMLElement): HTMLElement {
  return el.querySelector('.tng-number-range') as HTMLElement;
}

function getMinInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.tng-number-range__input--min') as HTMLInputElement;
}

function getMaxInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.tng-number-range__input--max') as HTMLInputElement;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: Validation - range order', () => {
  it('should be valid when both values are null', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: null, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be valid when only min is set', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 10, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be valid when only max is set', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: null, max: 100 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be valid when min is less than max', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be valid when min equals max', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 50, max: 50 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be invalid when min is greater than max', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });

  it('should become valid again when min is corrected below max', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    fixture.componentInstance.rangeValue = { min: 5, max: 10 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should become valid again when max is corrected above min', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    fixture.componentInstance.rangeValue = { min: 100, max: 200 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should become valid when min is cleared from an invalid range', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    fixture.componentInstance.rangeValue = { min: null, max: 10 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should become valid when max is cleared from an invalid range', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    fixture.componentInstance.rangeValue = { min: 100, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should not prevent typing a min value greater than max', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: null, max: 10 };
    fixture.detectChanges();
    // typing 100 into min should be allowed; group becomes invalid but input remains
    dispatchInput(getMinInput(fixture.nativeElement), '100');
    expect(getMinInput(fixture.nativeElement).value).toBe('100');
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });

  it('should not prevent typing a max value less than min', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: null };
    fixture.detectChanges();
    dispatchInput(getMaxInput(fixture.nativeElement), '10');
    expect(getMaxInput(fixture.nativeElement).value).toBe('10');
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });
});

describe('tng-number-range: Validation - configured boundaries', () => {
  it('should be valid when min value equals configured lower boundary', () => {
    const fixture = setup();
    fixture.componentInstance.minBound = 0;
    fixture.componentInstance.rangeValue = { min: 0, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be valid when min value is greater than configured lower boundary', () => {
    const fixture = setup();
    fixture.componentInstance.minBound = 0;
    fixture.componentInstance.rangeValue = { min: 5, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be invalid when min value is less than configured lower boundary', () => {
    const fixture = setup();
    fixture.componentInstance.minBound = 0;
    fixture.componentInstance.rangeValue = { min: -1, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });

  it('should be valid when max value equals configured upper boundary', () => {
    const fixture = setup();
    fixture.componentInstance.maxBound = 100;
    fixture.componentInstance.rangeValue = { min: null, max: 100 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be valid when max value is less than configured upper boundary', () => {
    const fixture = setup();
    fixture.componentInstance.maxBound = 100;
    fixture.componentInstance.rangeValue = { min: null, max: 90 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should be invalid when max value is greater than configured upper boundary', () => {
    const fixture = setup();
    fixture.componentInstance.maxBound = 100;
    fixture.componentInstance.rangeValue = { min: null, max: 110 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });

  it('should become valid when out-of-bound min is corrected', () => {
    const fixture = setup();
    fixture.componentInstance.minBound = 0;
    fixture.componentInstance.rangeValue = { min: -5, max: null };
    fixture.detectChanges();
    fixture.componentInstance.rangeValue = { min: 1, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should become valid when out-of-bound max is corrected', () => {
    const fixture = setup();
    fixture.componentInstance.maxBound = 100;
    fixture.componentInstance.rangeValue = { min: null, max: 200 };
    fixture.detectChanges();
    fixture.componentInstance.rangeValue = { min: null, max: 50 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should allow null min even when lower boundary is configured', () => {
    const fixture = setup();
    fixture.componentInstance.minBound = 0;
    fixture.componentInstance.rangeValue = { min: null, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should allow null max even when upper boundary is configured', () => {
    const fixture = setup();
    fixture.componentInstance.maxBound = 100;
    fixture.componentInstance.rangeValue = { min: null, max: null };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should recalculate validity when configured lower boundary changes', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 5, max: null };
    fixture.componentInstance.minBound = 0;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);

    fixture.componentInstance.minBound = 10;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });

  it('should recalculate validity when configured upper boundary changes', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: null, max: 80 };
    fixture.componentInstance.maxBound = 100;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);

    fixture.componentInstance.maxBound = 50;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });
});

describe('tng-number-range: External invalid state', () => {
  it('should be invalid when external invalid input is true', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });

  it('should be valid when external invalid input is false and internal validation passes', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = false;
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(false);
  });

  it('should reflect invalid state on root when external invalid is true', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).getAttribute('data-invalid')).toBe('');
  });

  it('should reflect invalid state on min input when external invalid is true', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBe('true');
  });

  it('should reflect invalid state on max input when external invalid is true', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('aria-invalid')).toBe('true');
  });

  it('should combine external invalid state with internal range-order invalid state', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.componentInstance.rangeValue = { min: 50, max: 100 }; // order valid
    fixture.detectChanges();
    // still invalid because of external flag
    expect(getGroup(fixture.nativeElement).hasAttribute('data-invalid')).toBe(true);
  });
});
