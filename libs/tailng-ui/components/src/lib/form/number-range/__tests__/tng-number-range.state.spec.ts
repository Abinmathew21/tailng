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
      [disabled]="disabled"
      [readonly]="readonly"
      [value]="rangeValue"
      (valueChange)="onValueChange($event)"
      (rangeChange)="onRangeChange()"
    />
  `,
})
class StateHostComponent {
  public disabled = false;
  public readonly = false;
  public rangeValue: TngNumberRangeValue = { min: 10, max: 100 };
  public emittedValueCount = 0;
  public emittedRangeCount = 0;

  public onValueChange(): void {
    this.emittedValueCount++;
  }

  public onRangeChange(): void {
    this.emittedRangeCount++;
  }
}

function setup() {
  const fixture = TestBed.configureTestingModule({
    imports: [StateHostComponent],
  }).createComponent(StateHostComponent);
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

// ── Disabled ─────────────────────────────────────────────────────────────────

describe('tng-number-range: Disabled behavior', () => {
  it('should disable both inputs when disabled is true', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).disabled).toBe(true);
    expect(getMaxInput(fixture.nativeElement).disabled).toBe(true);
  });

  it('should enable both inputs when disabled is false', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).disabled).toBe(false);
    expect(getMaxInput(fixture.nativeElement).disabled).toBe(false);
  });

  it('should reflect disabled state on the root container', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-disabled')).toBe(true);
  });

  it('should not emit valueChange when disabled input event is ignored', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    // Dispatching to a disabled input will be a no-op at the component level
    const min = getMinInput(fixture.nativeElement);
    min.value = '50';
    min.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.emittedValueCount).toBe(0);
  });

  it('should not emit rangeChange when disabled input event is ignored', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const min = getMinInput(fixture.nativeElement);
    min.value = '50';
    min.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.emittedRangeCount).toBe(0);
  });

  it('should update disabled state when input changes', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).disabled).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).disabled).toBe(true);
  });
});

// ── Readonly ──────────────────────────────────────────────────────────────────

describe('tng-number-range: Readonly behavior', () => {
  it('should mark both inputs readonly when readonly is true', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).readOnly).toBe(true);
    expect(getMaxInput(fixture.nativeElement).readOnly).toBe(true);
  });

  it('should remove readonly from both inputs when readonly is false', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = false;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).readOnly).toBe(false);
    expect(getMaxInput(fixture.nativeElement).readOnly).toBe(false);
  });

  it('should reflect readonly state on the root container', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).hasAttribute('data-readonly')).toBe(true);
  });

  it('should not emit valueChange when readonly input event is ignored', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();

    const min = getMinInput(fixture.nativeElement);
    min.value = '50';
    min.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.emittedValueCount).toBe(0);
  });

  it('should not emit rangeChange when readonly input event is ignored', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();

    const min = getMinInput(fixture.nativeElement);
    min.value = '50';
    min.dispatchEvent(new Event('input', { bubbles: true }));

    expect(fixture.componentInstance.emittedRangeCount).toBe(0);
  });

  it('should update readonly state when input changes', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = false;
    fixture.detectChanges();
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).readOnly).toBe(true);
  });
});

// ── Host / data attributes ────────────────────────────────────────────────────

describe('tng-number-range: Host attributes and data attributes', () => {
  it('should expose disabled state through a data attribute', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('tng-number-range') as HTMLElement;
    expect(host.hasAttribute('data-disabled')).toBe(true);
  });

  it('should expose readonly state through a data attribute', () => {
    const fixture = setup();
    fixture.componentInstance.readonly = true;
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('tng-number-range') as HTMLElement;
    expect(host.hasAttribute('data-readonly')).toBe(true);
  });

  it('should expose invalid state through a data attribute', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('tng-number-range') as HTMLElement;
    expect(host.hasAttribute('data-invalid')).toBe(true);
  });

  it('should not render false string values for boolean data attributes', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('tng-number-range') as HTMLElement;
    expect(host.getAttribute('data-disabled')).not.toBe('false');
  });

  it('should remove state data attributes when state is false', () => {
    const fixture = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('tng-number-range') as HTMLElement;
    expect(host.hasAttribute('data-disabled')).toBe(false);
  });
});
