import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import {
  normalizeRangeValue,
  parseNumberInput,
  isRangeValid,
} from '@tailng-ui/primitives';
import type {
  TngNumberRangeChangeEvent,
  TngNumberRangeSlots,
  TngNumberRangeValue,
} from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Slot hosts ────────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range [slot]="slot()" />
  `,
})
class SlotHostComponent {
  public slot = signal<Partial<Record<TngNumberRangeSlots, string>>>({});
}

// ── Edge-case hosts ──────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue()"
      (valueChange)="emitted.push($event)"
    />
  `,
})
class EdgeHostComponent {
  public rangeValue = signal<TngNumberRangeValue | null>(null);
  public emitted: TngNumberRangeValue[] = [];
}

// ── RangeChange hosts ────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="v()"
      (rangeChange)="events.push($event)"
    />
  `,
})
class RangeChangeHost {
  public v = signal<TngNumberRangeValue>({ min: 10, max: 100 });
  public events: TngNumberRangeChangeEvent[] = [];
}

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue()"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class SyncedEdgeHostComponent {
  public rangeValue = signal<TngNumberRangeValue | null>(null);
  public emitted: TngNumberRangeValue[] = [];

  public onValueChange(value: TngNumberRangeValue): void {
    this.emitted.push(value);
    this.rangeValue.set(value);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function setup<T>(hostType: new () => T): ComponentFixture<T> {
  const fixture = TestBed.configureTestingModule({
    imports: [hostType],
  }).createComponent(hostType);

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

function getSeparatorFromFixture<T>(fixture: ComponentFixture<T>): HTMLElement {
  return getNativeElement(fixture).querySelector(
    '.tng-number-range__separator',
  )!;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// ── Slot tests ────────────────────────────────────────────────────────────────

describe('tng-number-range: Slot / class customization', () => {
  it('should apply root slot class when provided', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ root: 'custom-root' });
    fixture.detectChanges();

    expect(
      getGroupFromFixture(fixture).classList.contains('custom-root'),
    ).toBe(true);
  });

  it('should apply min input slot class when provided', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ minInput: 'custom-min' });
    fixture.detectChanges();

    expect(
      getMinInputFromFixture(fixture).classList.contains('custom-min'),
    ).toBe(true);
  });

  it('should apply max input slot class when provided', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ maxInput: 'custom-max' });
    fixture.detectChanges();

    expect(
      getMaxInputFromFixture(fixture).classList.contains('custom-max'),
    ).toBe(true);
  });

  it('should apply separator slot class when provided', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ separator: 'custom-sep' });
    fixture.detectChanges();

    expect(
      getSeparatorFromFixture(fixture).classList.contains('custom-sep'),
    ).toBe(true);
  });

  it('should merge slot classes with default classes', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ minInput: 'extra-min' });
    fixture.detectChanges();

    const min = getMinInputFromFixture(fixture);

    expect(min.classList.contains('tng-number-range__input')).toBe(true);
    expect(min.classList.contains('extra-min')).toBe(true);
  });

  it('should not remove default classes when slot classes are provided', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ root: 'my-root' });
    fixture.detectChanges();

    expect(
      getGroupFromFixture(fixture).classList.contains('tng-number-range'),
    ).toBe(true);
  });

  it('should update slot classes when slot input changes', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({ root: 'class-a' });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).classList.contains('class-a')).toBe(
      true,
    );

    fixture.componentInstance.slot.set({ root: 'class-b' });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).classList.contains('class-b')).toBe(
      true,
    );
  });

  it('should tolerate missing slot map', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({});
    fixture.detectChanges();

    expect(
      getGroupFromFixture(fixture).classList.contains('tng-number-range'),
    ).toBe(true);
  });

  it('should ignore unknown slot keys safely', () => {
    const fixture = setup(SlotHostComponent);

    fixture.componentInstance.slot.set({
      unknownKey: 'noop',
    } as Partial<Record<TngNumberRangeSlots, string>>);

    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('tng-number-range: Edge cases', () => {
  it('should handle very large min values', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({
      min: Number.MAX_SAFE_INTEGER,
      max: null,
    });
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).value).toBe(
      String(Number.MAX_SAFE_INTEGER),
    );
  });

  it('should handle very large max values', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({
      min: null,
      max: Number.MAX_SAFE_INTEGER,
    });
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).value).toBe(
      String(Number.MAX_SAFE_INTEGER),
    );
  });

  it('should handle negative ranges', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({ min: -200, max: -10 });
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).value).toBe('-200');
    expect(getMaxInputFromFixture(fixture).value).toBe('-10');
  });

  it('should handle min and max both set to zero', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({ min: 0, max: 0 });
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).value).toBe('0');
    expect(getMaxInputFromFixture(fixture).value).toBe('0');
  });

  it('should handle min and max both set to the same value', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({ min: 42, max: 42 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-invalid')).toBe(
      false,
    );
  });

  it('should handle clearing both inputs', () => {
    const fixture = setup(SyncedEdgeHostComponent);
  
    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();
  
    dispatchInput(getMinInputFromFixture(fixture), '');
    fixture.detectChanges();
  
    dispatchInput(getMaxInputFromFixture(fixture), '');
    fixture.detectChanges();
  
    const last = fixture.componentInstance.emitted.at(-1);
  
    expect(last).toEqual({ min: null, max: null });
    expect(fixture.componentInstance.rangeValue()).toEqual({
      min: null,
      max: null,
    });
  });

  it('should handle value object with undefined min by normalizing to null', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({
      min: undefined as unknown as null,
      max: 100,
    });
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).value).toBe('');
  });

  it('should handle value object with undefined max by normalizing to null', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set({
      min: 10,
      max: undefined as unknown as null,
    });
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).value).toBe('');
  });

  it('should not throw when controlled value is null', () => {
    const fixture = setup(EdgeHostComponent);

    fixture.componentInstance.rangeValue.set(null);

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not throw when event target is not an input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngNumberRangeComponent],
    }).createComponent(TngNumberRangeComponent);

    fixture.detectChanges();

    const badEvent = new Event('input', { bubbles: true });

    Object.defineProperty(badEvent, 'target', {
      value: document.createElement('div'),
    });

    expect(() => fixture.componentInstance.onMinInput(badEvent)).not.toThrow();
  });

  it('should handle rapid min input changes without emitting stale values', () => {
    const fixture = setup(EdgeHostComponent);
    const min = getMinInputFromFixture(fixture);

    dispatchInput(min, '10');
    dispatchInput(min, '20');
    dispatchInput(min, '30');

    const last = fixture.componentInstance.emitted.at(-1);

    expect(last?.min).toBe(30);
  });

  it('should handle rapid max input changes without emitting stale values', () => {
    const fixture = setup(EdgeHostComponent);
    const max = getMaxInputFromFixture(fixture);

    dispatchInput(max, '100');
    dispatchInput(max, '200');
    dispatchInput(max, '300');

    const last = fixture.componentInstance.emitted.at(-1);

    expect(last?.max).toBe(300);
  });
});

// ── Public API / type exports ────────────────────────────────────────────────

describe('tng-number-range: Public API exports', () => {

  it('should expose normalizeRangeValue from the primitives barrel', async () => {
    expect(typeof normalizeRangeValue).toBe('function');
  });
  it('should expose parseNumberInput from the primitives barrel', async () => {
     expect(typeof parseNumberInput).toBe('function');
  });

  it('should expose isRangeValid from the primitives barrel', async () => {
  expect(typeof isRangeValid).toBe('function');
  });
});

// ── RangeChange event ─────────────────────────────────────────────────────────

describe('tng-number-range: rangeChange event shape', () => {
  it('should emit rangeChange.source as min for min input changes', () => {
    const fixture = setup(RangeChangeHost);

    dispatchInput(getMinInputFromFixture(fixture), '20');

    expect(fixture.componentInstance.events[0].source).toBe('min');
  });

  it('should emit rangeChange.source as max for max input changes', () => {
    const fixture = setup(RangeChangeHost);

    dispatchInput(getMaxInputFromFixture(fixture), '200');

    expect(fixture.componentInstance.events[0].source).toBe('max');
  });

  it('should emit rangeChange.valid as true for a valid range', () => {
    const fixture = setup(RangeChangeHost);

    dispatchInput(getMinInputFromFixture(fixture), '20');

    expect(fixture.componentInstance.events[0].valid).toBe(true);
  });

  it('should emit rangeChange.valid as false for an invalid range when min is greater than max', () => {
    const fixture = setup(RangeChangeHost);

    dispatchInput(getMinInputFromFixture(fixture), '200');

    expect(fixture.componentInstance.events[0].valid).toBe(false);
  });
});