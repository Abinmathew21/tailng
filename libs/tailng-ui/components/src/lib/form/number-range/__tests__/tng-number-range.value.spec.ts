import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import type { TngNumberRangeValue } from '@tailng-ui/primitives';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Host helpers ────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range />`,
})
class DefaultHostComponent {}

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue"
      (valueChange)="onValueChange($event)"
      (rangeChange)="onRangeChange($event)"
    />
  `,
})
class ControlledHostComponent {
  public rangeValue: TngNumberRangeValue | null = { min: 10, max: 100 };
  public emittedValues: TngNumberRangeValue[] = [];
  public rangeChangeCount = 0;

  public onValueChange(v: TngNumberRangeValue): void {
    this.emittedValues.push(v);
  }

  public onRangeChange(): void {
    this.rangeChangeCount++;
  }
}

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [defaultValue]="defaultValue"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class UncontrolledHostComponent {
  public defaultValue: TngNumberRangeValue | null = { min: 5, max: 50 };
  public emittedValues: TngNumberRangeValue[] = [];

  public onValueChange(v: TngNumberRangeValue): void {
    this.emittedValues.push(v);
  }
}

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range [value]="rangeValue" />`,
})
class NullValueHostComponent {
  public rangeValue: TngNumberRangeValue | null = null;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function setup<T>(hostType: new () => T) {
  const fixture = TestBed.configureTestingModule({
    imports: [hostType],
  }).createComponent(hostType);
  fixture.detectChanges();
  return fixture;
}

function getMinInput(nativeElement: HTMLElement): HTMLInputElement {
  return nativeElement.querySelector('.tng-number-range__input--min') as HTMLInputElement;
}

function getMaxInput(nativeElement: HTMLElement): HTMLInputElement {
  return nativeElement.querySelector('.tng-number-range__input--max') as HTMLInputElement;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('tng-number-range: Default value behavior', () => {
  it('should initialize with { min: null, max: null } when no value is provided', () => {
    const fixture = setup(DefaultHostComponent);
    const min = getMinInput(fixture.nativeElement);
    const max = getMaxInput(fixture.nativeElement);
    expect(min.value).toBe('');
    expect(max.value).toBe('');
  });

  it('should initialize min input as empty when min is null', () => {
    const fixture = setup(DefaultHostComponent);
    expect(getMinInput(fixture.nativeElement).value).toBe('');
  });

  it('should initialize max input as empty when max is null', () => {
    const fixture = setup(DefaultHostComponent);
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should initialize min input with the provided default min value', () => {
    const fixture = setup(UncontrolledHostComponent);
    expect(getMinInput(fixture.nativeElement).value).toBe('5');
  });

  it('should initialize max input with the provided default max value', () => {
    const fixture = setup(UncontrolledHostComponent);
    expect(getMaxInput(fixture.nativeElement).value).toBe('50');
  });

  it('should not emit valueChange during initial render', () => {
    const fixture = setup(ControlledHostComponent);
    expect(fixture.componentInstance.emittedValues.length).toBe(0);
  });

  it('should not emit rangeChange during initial render', () => {
    const fixture = setup(ControlledHostComponent);
    expect(fixture.componentInstance.rangeChangeCount).toBe(0);
  });
});

describe('tng-number-range: Controlled value behavior', () => {
  it('should display the provided controlled min value', () => {
    const fixture = setup(ControlledHostComponent);
    expect(getMinInput(fixture.nativeElement).value).toBe('10');
  });

  it('should display the provided controlled max value', () => {
    const fixture = setup(ControlledHostComponent);
    expect(getMaxInput(fixture.nativeElement).value).toBe('100');
  });

  it('should update displayed min value when controlled value changes', () => {
    const fixture = setup(ControlledHostComponent);
    fixture.componentInstance.rangeValue = { min: 20, max: 100 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('20');
  });

  it('should update displayed max value when controlled value changes', () => {
    const fixture = setup(ControlledHostComponent);
    fixture.componentInstance.rangeValue = { min: 10, max: 200 };
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).value).toBe('200');
  });

  it('should not mutate the provided controlled value object', () => {
    const fixture = setup(ControlledHostComponent);
    const original = fixture.componentInstance.rangeValue!;
    const originalRef = original;

    dispatchInput(getMinInput(fixture.nativeElement), '99');

    expect(fixture.componentInstance.rangeValue).toBe(originalRef);
  });

  it('should emit a fresh value object when the min input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '15');

    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted).not.toBe(fixture.componentInstance.rangeValue);
  });

  it('should emit a fresh value object when the max input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '150');

    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted).not.toBe(fixture.componentInstance.rangeValue);
  });

  it('should preserve max value when only min changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');

    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted.max).toBe(100);
  });

  it('should preserve min value when only max changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '200');

    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted.min).toBe(10);
  });

  it('should handle a controlled null value by displaying empty inputs', () => {
    const fixture = setup(NullValueHostComponent);
    expect(getMinInput(fixture.nativeElement).value).toBe('');
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should handle a controlled partial value with min only', () => {
    const fixture = setup(NullValueHostComponent);
    fixture.componentInstance.rangeValue = { min: 10, max: null };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('10');
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should handle a controlled partial value with max only', () => {
    const fixture = setup(NullValueHostComponent);
    fixture.componentInstance.rangeValue = { min: null, max: 50 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('');
    expect(getMaxInput(fixture.nativeElement).value).toBe('50');
  });
});

describe('tng-number-range: Uncontrolled value behavior', () => {
  it('should use internal state when no controlled value is provided', () => {
    const fixture = setup(DefaultHostComponent);
    const min = getMinInput(fixture.nativeElement);
    expect(min.value).toBe('');
  });

  it('should update internal min value when min input changes', () => {
    const fixture = setup(DefaultHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '42');
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('42');
  });

  it('should update internal max value when max input changes', () => {
    const fixture = setup(DefaultHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '99');
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).value).toBe('99');
  });

  it('should preserve max value when min changes in uncontrolled mode', () => {
    const fixture = setup(UncontrolledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted.max).toBe(50);
  });

  it('should preserve min value when max changes in uncontrolled mode', () => {
    const fixture = setup(UncontrolledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '80');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted.min).toBe(5);
  });

  it('should support clearing min in uncontrolled mode', () => {
    const fixture = setup(UncontrolledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted.min).toBeNull();
  });

  it('should support clearing max in uncontrolled mode', () => {
    const fixture = setup(UncontrolledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted.max).toBeNull();
  });
});

describe('tng-number-range: Number parsing', () => {
  it('should parse an integer min value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '42');
    expect(fixture.componentInstance.emittedValues[0].min).toBe(42);
  });

  it('should parse an integer max value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '200');
    expect(fixture.componentInstance.emittedValues[0].max).toBe(200);
  });

  it('should parse a decimal min value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '3.14');
    expect(fixture.componentInstance.emittedValues[0].min).toBeCloseTo(3.14);
  });

  it('should parse a decimal max value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '99.9');
    expect(fixture.componentInstance.emittedValues[0].max).toBeCloseTo(99.9);
  });

  it('should parse a negative min value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '-5');
    expect(fixture.componentInstance.emittedValues[0].min).toBe(-5);
  });

  it('should parse a negative max value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '-1');
    expect(fixture.componentInstance.emittedValues[0].max).toBe(-1);
  });

  it('should parse zero as a valid min value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '0');
    expect(fixture.componentInstance.emittedValues[0].min).toBe(0);
  });

  it('should parse zero as a valid max value', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '0');
    expect(fixture.componentInstance.emittedValues[0].max).toBe(0);
  });

  it('should convert an empty min input to null', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '');
    expect(fixture.componentInstance.emittedValues[0].min).toBeNull();
  });

  it('should convert an empty max input to null', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '');
    expect(fixture.componentInstance.emittedValues[0].max).toBeNull();
  });

  it('should not emit NaN for invalid min input', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), 'abc');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted?.min).toBeNull();
  });

  it('should not emit NaN for invalid max input', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), 'xyz');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted?.max).toBeNull();
  });
});

describe('tng-number-range: Value emission', () => {
  it('should emit valueChange when min input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.emittedValues.length).toBe(1);
  });

  it('should emit valueChange when max input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '200');
    expect(fixture.componentInstance.emittedValues.length).toBe(1);
  });

  it('should emit full range value when min input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted).toEqual({ min: 20, max: 100 });
  });

  it('should emit full range value when max input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '200');
    const emitted = fixture.componentInstance.emittedValues[0];
    expect(emitted).toEqual({ min: 10, max: 200 });
  });

  it('should emit min as null when min input is cleared', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '');
    expect(fixture.componentInstance.emittedValues[0].min).toBeNull();
  });

  it('should emit max as null when max input is cleared', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '');
    expect(fixture.componentInstance.emittedValues[0].max).toBeNull();
  });

  it('should emit rangeChange when min input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.rangeChangeCount).toBe(1);
  });

  it('should emit rangeChange when max input changes', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMaxInput(fixture.nativeElement), '200');
    expect(fixture.componentInstance.rangeChangeCount).toBe(1);
  });

  it('should not emit duplicate valueChange events for a single input event', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.emittedValues.length).toBe(1);
  });

  it('should not emit duplicate rangeChange events for a single input event', () => {
    const fixture = setup(ControlledHostComponent);
    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.rangeChangeCount).toBe(1);
  });
});
