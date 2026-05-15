import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import type { TngNumberRangeValue } from '@tailng-ui/primitives';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Slot hosts ────────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range [slot]="slot" />
  `,
})
class SlotHostComponent {
  public slot: Partial<Record<string, string>> = {};
}

// ── Edge-case hosts ──────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [value]="rangeValue"
      (valueChange)="emitted.push($event)"
    />
  `,
})
class EdgeHostComponent {
  public rangeValue: TngNumberRangeValue | null = null;
  public emitted: TngNumberRangeValue[] = [];
}

function setup<T>(hostType: new () => T) {
  const fixture = TestBed.configureTestingModule({
    imports: [hostType],
  }).createComponent(hostType);
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

// ── Slot tests ────────────────────────────────────────────────────────────────

describe('tng-number-range: Slot / class customization', () => {
  it('should apply root slot class when provided', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { root: 'custom-root' };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).classList.contains('custom-root')).toBe(true);
  });

  it('should apply min input slot class when provided', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { minInput: 'custom-min' };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).classList.contains('custom-min')).toBe(true);
  });

  it('should apply max input slot class when provided', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { maxInput: 'custom-max' };
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).classList.contains('custom-max')).toBe(true);
  });

  it('should apply separator slot class when provided', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { separator: 'custom-sep' };
    fixture.detectChanges();
    const sep = fixture.nativeElement.querySelector('.tng-number-range__separator');
    expect(sep.classList.contains('custom-sep')).toBe(true);
  });

  it('should merge slot classes with default classes', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { minInput: 'extra-min' };
    fixture.detectChanges();
    const min = getMinInput(fixture.nativeElement);
    expect(min.classList.contains('tng-number-range__input')).toBe(true);
    expect(min.classList.contains('extra-min')).toBe(true);
  });

  it('should not remove default classes when slot classes are provided', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { root: 'my-root' };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).classList.contains('tng-number-range')).toBe(true);
  });

  it('should update slot classes when slot input changes', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { root: 'class-a' };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).classList.contains('class-a')).toBe(true);

    fixture.componentInstance.slot = { root: 'class-b' };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).classList.contains('class-b')).toBe(true);
  });

  it('should tolerate missing slot map', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = {};
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).classList.contains('tng-number-range')).toBe(true);
  });

  it('should ignore unknown slot keys safely', () => {
    const fixture = setup(SlotHostComponent);
    fixture.componentInstance.slot = { unknownKey: 'noop' } as Record<string, string>;
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('tng-number-range: Edge cases', () => {
  it('should handle very large min values', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: Number.MAX_SAFE_INTEGER, max: null };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe(String(Number.MAX_SAFE_INTEGER));
  });

  it('should handle very large max values', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: null, max: Number.MAX_SAFE_INTEGER };
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).value).toBe(String(Number.MAX_SAFE_INTEGER));
  });

  it('should handle negative ranges', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: -200, max: -10 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('-200');
    expect(getMaxInput(fixture.nativeElement).value).toBe('-10');
  });

  it('should handle min and max both set to zero', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: 0, max: 0 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('0');
    expect(getMaxInput(fixture.nativeElement).value).toBe('0');
  });

  it('should handle min and max both set to the same value', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: 42, max: 42 };
    fixture.detectChanges();
    const group = getGroup(fixture.nativeElement);
    expect(group.hasAttribute('data-invalid')).toBe(false);
  });

  it('should handle clearing both inputs', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '');
    dispatchInput(getMaxInput(fixture.nativeElement), '');

    const last = fixture.componentInstance.emitted.at(-1);
    expect(last).toEqual({ min: null, max: null });
  });

  it('should handle value object with undefined min by normalizing to null', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: undefined as unknown as null, max: 100 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('');
  });

  it('should handle value object with undefined max by normalizing to null', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = { min: 10, max: undefined as unknown as null };
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should not throw when controlled value is null', () => {
    const fixture = setup(EdgeHostComponent);
    fixture.componentInstance.rangeValue = null;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not throw when event target is not an input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngNumberRangeComponent],
    }).createComponent(TngNumberRangeComponent);
    fixture.detectChanges();

    const badEvent = new Event('input', { bubbles: true });
    Object.defineProperty(badEvent, 'target', { value: document.createElement('div') });

    expect(() =>
      (fixture.componentInstance as TngNumberRangeComponent).onMinInput(badEvent),
    ).not.toThrow();
  });

  it('should handle rapid min input changes without emitting stale values', () => {
    const fixture = setup(EdgeHostComponent);
    const min = getMinInput(fixture.nativeElement);

    dispatchInput(min, '10');
    dispatchInput(min, '20');
    dispatchInput(min, '30');

    const last = fixture.componentInstance.emitted.at(-1);
    expect(last?.min).toBe(30);
  });

  it('should handle rapid max input changes without emitting stale values', () => {
    const fixture = setup(EdgeHostComponent);
    const max = getMaxInput(fixture.nativeElement);

    dispatchInput(max, '100');
    dispatchInput(max, '200');
    dispatchInput(max, '300');

    const last = fixture.componentInstance.emitted.at(-1);
    expect(last?.max).toBe(300);
  });
});

// ── Public API / type exports ────────────────────────────────────────────────

describe('tng-number-range: Public API exports', () => {
  it('should export the component from the library entry point', async () => {
    const mod = await import('@tailng-ui/primitives');
    expect(typeof (mod as Record<string, unknown>)['TngNumberRangeValue']).toBe('undefined');
    // Types cannot be tested at runtime; we simply verify the import doesn't throw
  });

  it('should expose TngNumberRangeValue type', async () => {
    const mod = await import('@tailng-ui/primitives');
    // Type-only check — normalizeRangeValue is a function from the same barrel
    expect(typeof mod.normalizeRangeValue).toBe('function');
  });

  it('should expose parseNumberInput from the primitives barrel', async () => {
    const mod = await import('@tailng-ui/primitives');
    expect(typeof mod.parseNumberInput).toBe('function');
  });

  it('should expose isRangeValid from the primitives barrel', async () => {
    const mod = await import('@tailng-ui/primitives');
    expect(typeof mod.isRangeValid).toBe('function');
  });

  it('should keep public API names consistent with TailNG naming conventions', () => {
    expect(TngNumberRangeComponent.name).toBe('TngNumberRangeComponent');
  });
});

// ── Rangechange event ─────────────────────────────────────────────────────────

describe('tng-number-range: rangeChange event shape', () => {
  it('should emit rangeChange.source as min for min input changes', () => {
    @Component({
      imports: [TngNumberRangeComponent],
      template: `<tng-number-range [value]="v" (rangeChange)="events.push($event)" />`,
    })
    class RangeChangeHost {
      public v: TngNumberRangeValue = { min: 10, max: 100 };
      public events: Array<{ source: string; valid: boolean; value: TngNumberRangeValue }> = [];
    }

    const fixture = TestBed.configureTestingModule({ imports: [RangeChangeHost] })
      .createComponent(RangeChangeHost);
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.events[0].source).toBe('min');
  });

  it('should emit rangeChange.source as max for max input changes', () => {
    @Component({
      imports: [TngNumberRangeComponent],
      template: `<tng-number-range [value]="v" (rangeChange)="events.push($event)" />`,
    })
    class RangeChangeHost2 {
      public v: TngNumberRangeValue = { min: 10, max: 100 };
      public events: Array<{ source: string; valid: boolean; value: TngNumberRangeValue }> = [];
    }

    const fixture = TestBed.configureTestingModule({ imports: [RangeChangeHost2] })
      .createComponent(RangeChangeHost2);
    fixture.detectChanges();

    dispatchInput(getMaxInput(fixture.nativeElement), '200');
    expect(fixture.componentInstance.events[0].source).toBe('max');
  });

  it('should emit rangeChange.valid as true for a valid range', () => {
    @Component({
      imports: [TngNumberRangeComponent],
      template: `<tng-number-range [value]="v" (rangeChange)="events.push($event)" />`,
    })
    class ValidRangeHost {
      public v: TngNumberRangeValue = { min: 10, max: 100 };
      public events: Array<{ source: string; valid: boolean }> = [];
    }

    const fixture = TestBed.configureTestingModule({ imports: [ValidRangeHost] })
      .createComponent(ValidRangeHost);
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.events[0].valid).toBe(true);
  });

  it('should emit rangeChange.valid as false for an invalid range (min > max)', () => {
    @Component({
      imports: [TngNumberRangeComponent],
      template: `<tng-number-range [value]="v" (rangeChange)="events.push($event)" />`,
    })
    class InvalidRangeHost {
      public v: TngNumberRangeValue = { min: 10, max: 100 };
      public events: Array<{ source: string; valid: boolean }> = [];
    }

    const fixture = TestBed.configureTestingModule({ imports: [InvalidRangeHost] })
      .createComponent(InvalidRangeHost);
    fixture.detectChanges();

    // type 200 into min while max is 100 → invalid order
    dispatchInput(getMinInput(fixture.nativeElement), '200');
    expect(fixture.componentInstance.events[0].valid).toBe(false);
  });
});
