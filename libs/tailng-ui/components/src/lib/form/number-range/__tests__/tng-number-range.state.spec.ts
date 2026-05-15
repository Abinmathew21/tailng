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
      [disabled]="disabled()"
      [readonly]="readonly()"
      [value]="rangeValue()"
      (valueChange)="onValueChange()"
      (rangeChange)="onRangeChange()"
    />
  `,
})
class StateHostComponent {
  public disabled = signal(false);
  public readonly = signal(false);

  public rangeValue = signal<TngNumberRangeValue>({
    min: 10,
    max: 100,
  });

  public emittedValueCount = 0;
  public emittedRangeCount = 0;

  public onValueChange(): void {
    this.emittedValueCount++;
  }

  public onRangeChange(): void {
    this.emittedRangeCount++;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function setup(): ComponentFixture<StateHostComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [StateHostComponent],
  }).createComponent(StateHostComponent);

  fixture.detectChanges();

  return fixture;
}

function getNativeElement(
  fixture: ComponentFixture<StateHostComponent>,
): HTMLElement {
  return fixture.debugElement.nativeElement as unknown as HTMLElement;
}

function getHostFromFixture(
  fixture: ComponentFixture<StateHostComponent>,
): HTMLElement {
  return getNativeElement(fixture).querySelector('tng-number-range')!;
}

function getGroupFromFixture(
  fixture: ComponentFixture<StateHostComponent>,
): HTMLElement {
  return getNativeElement(fixture).querySelector('.tng-number-range')!;
}

function getMinInputFromFixture(
  fixture: ComponentFixture<StateHostComponent>,
): HTMLInputElement {
  return getNativeElement(fixture).querySelector(
    '.tng-number-range__input--min',
  )!;
}

function getMaxInputFromFixture(
  fixture: ComponentFixture<StateHostComponent>,
): HTMLInputElement {
  return getNativeElement(fixture).querySelector(
    '.tng-number-range__input--max',
  )!;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// ── Disabled ─────────────────────────────────────────────────────────────────

describe('tng-number-range: Disabled behavior', () => {
  it('should disable both inputs when disabled is true', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).disabled).toBe(true);
    expect(getMaxInputFromFixture(fixture).disabled).toBe(true);
  });

  it('should enable both inputs when disabled is false', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).disabled).toBe(false);
    expect(getMaxInputFromFixture(fixture).disabled).toBe(false);
  });

  it('should reflect disabled state on the root container', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-disabled')).toBe(
      true,
    );
  });

  it('should not emit valueChange when disabled input event is ignored', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    dispatchInput(getMinInputFromFixture(fixture), '50');

    expect(fixture.componentInstance.emittedValueCount).toBe(0);
  });

  it('should not emit rangeChange when disabled input event is ignored', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    dispatchInput(getMinInputFromFixture(fixture), '50');

    expect(fixture.componentInstance.emittedRangeCount).toBe(0);
  });

  it('should update disabled state when input changes', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).disabled).toBe(false);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).disabled).toBe(true);
  });
});

// ── Readonly ──────────────────────────────────────────────────────────────────

describe('tng-number-range: Readonly behavior', () => {
  it('should mark both inputs readonly when readonly is true', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).readOnly).toBe(true);
    expect(getMaxInputFromFixture(fixture).readOnly).toBe(true);
  });

  it('should remove readonly from both inputs when readonly is false', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(false);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).readOnly).toBe(false);
    expect(getMaxInputFromFixture(fixture).readOnly).toBe(false);
  });

  it('should reflect readonly state on the root container', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).hasAttribute('data-readonly')).toBe(
      true,
    );
  });

  it('should not emit valueChange when readonly input event is ignored', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    dispatchInput(getMinInputFromFixture(fixture), '50');

    expect(fixture.componentInstance.emittedValueCount).toBe(0);
  });

  it('should not emit rangeChange when readonly input event is ignored', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    dispatchInput(getMinInputFromFixture(fixture), '50');

    expect(fixture.componentInstance.emittedRangeCount).toBe(0);
  });

  it('should update readonly state when input changes', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(false);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).readOnly).toBe(false);

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).readOnly).toBe(true);
  });
});

// ── Host / data attributes ────────────────────────────────────────────────────

describe('tng-number-range: Host attributes and data attributes', () => {
  it('should expose disabled state through a data attribute', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getHostFromFixture(fixture).hasAttribute('data-disabled')).toBe(
      true,
    );
  });

  it('should expose readonly state through a data attribute', () => {
    const fixture = setup();

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    expect(getHostFromFixture(fixture).hasAttribute('data-readonly')).toBe(
      true,
    );
  });

  it('should expose invalid state through a data attribute', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getHostFromFixture(fixture).hasAttribute('data-invalid')).toBe(true);
  });

  it('should not render false string values for boolean data attributes', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    expect(getHostFromFixture(fixture).getAttribute('data-disabled')).not.toBe(
      'false',
    );
  });

  it('should remove state data attributes when state is false', () => {
    const fixture = setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getHostFromFixture(fixture).hasAttribute('data-disabled')).toBe(
      true,
    );

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    expect(getHostFromFixture(fixture).hasAttribute('data-disabled')).toBe(
      false,
    );
  });
});