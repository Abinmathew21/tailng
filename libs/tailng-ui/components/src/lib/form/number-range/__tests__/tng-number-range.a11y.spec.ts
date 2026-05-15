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
      [ariaLabel]="ariaLabel()"
      [ariaLabelledby]="ariaLabelledby()"
      [minAriaLabel]="minAriaLabel()"
      [maxAriaLabel]="maxAriaLabel()"
      [value]="rangeValue()"
      [invalid]="externalInvalid()"
    />
  `,
})
class A11yHostComponent {
  public ariaLabel = signal<string | null>('Price range');
  public ariaLabelledby = signal<string | null>(null);
  public minAriaLabel = signal('Minimum price');
  public maxAriaLabel = signal('Maximum price');
  public rangeValue = signal<TngNumberRangeValue>({ min: null, max: null });
  public externalInvalid = signal(false);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function setup(): ComponentFixture<A11yHostComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [A11yHostComponent],
  }).createComponent(A11yHostComponent);

  fixture.detectChanges();

  return fixture;
}

function setupComponent(): ComponentFixture<TngNumberRangeComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [TngNumberRangeComponent],
  }).createComponent(TngNumberRangeComponent);

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

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: Accessibility - group semantics', () => {
  it('should set role="group" on the root/group element', () => {
    const fixture = setup();

    expect(getGroupFromFixture(fixture).getAttribute('role')).toBe('group');
  });

  it('should apply aria-label to the group when ariaLabel is provided', () => {
    const fixture = setup();

    expect(getGroupFromFixture(fixture).getAttribute('aria-label')).toBe(
      'Price range',
    );
  });

  it('should apply aria-labelledby to the group when ariaLabelledby is provided', () => {
    const fixture = setup();

    fixture.componentInstance.ariaLabel.set(null);
    fixture.componentInstance.ariaLabelledby.set('range-label-id');
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).getAttribute('aria-labelledby')).toBe(
      'range-label-id',
    );
  });

  it('should not set empty aria-label', () => {
    const fixture = setup();

    fixture.componentInstance.ariaLabel.set('');
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).getAttribute('aria-label')).toBeNull();
  });

  it('should not set empty aria-labelledby', () => {
    const fixture = setup();

    fixture.componentInstance.ariaLabelledby.set('');
    fixture.detectChanges();

    expect(
      getGroupFromFixture(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
  });

  it('should keep the separator aria-hidden="true"', () => {
    const fixture = setup();

    expect(getSeparatorFromFixture(fixture).getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('should not expose separator text as an accessible name', () => {
    const fixture = setup();
    const separator = getSeparatorFromFixture(fixture);

    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
  });

  it('should keep group semantics stable after value changes', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).getAttribute('role')).toBe('group');
    expect(getGroupFromFixture(fixture).getAttribute('aria-label')).toBe(
      'Price range',
    );
  });
});

describe('tng-number-range: Accessibility - input labels', () => {
  it('should apply min input accessible label from minAriaLabel', () => {
    const fixture = setup();

    expect(getMinInputFromFixture(fixture).getAttribute('aria-label')).toBe(
      'Minimum price',
    );
  });

  it('should apply max input accessible label from maxAriaLabel', () => {
    const fixture = setup();

    expect(getMaxInputFromFixture(fixture).getAttribute('aria-label')).toBe(
      'Maximum price',
    );
  });

  it('should provide sensible default min input aria label if none is provided', () => {
    const fixture = setupComponent();

    expect(
      getMinInputFromFixture(fixture).getAttribute('aria-label'),
    ).toBeTruthy();
  });

  it('should provide sensible default max input aria label if none is provided', () => {
    const fixture = setupComponent();

    expect(
      getMaxInputFromFixture(fixture).getAttribute('aria-label'),
    ).toBeTruthy();
  });

  it('should update min input aria label when input changes', () => {
    const fixture = setup();

    fixture.componentInstance.minAriaLabel.set('From');
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('aria-label')).toBe(
      'From',
    );
  });

  it('should update max input aria label when input changes', () => {
    const fixture = setup();

    fixture.componentInstance.maxAriaLabel.set('To');
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).getAttribute('aria-label')).toBe(
      'To',
    );
  });

  it('should keep min and max input names distinct', () => {
    const fixture = setup();

    const minLabel = getMinInputFromFixture(fixture).getAttribute('aria-label');
    const maxLabel = getMaxInputFromFixture(fixture).getAttribute('aria-label');

    expect(minLabel).not.toBe(maxLabel);
  });
});

describe('tng-number-range: Accessibility - invalid state', () => {
  it('should set aria-invalid="true" on min input when range is invalid', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('should set aria-invalid="true" on max input when range is invalid', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 100, max: 10 });
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('should remove aria-invalid from min input when range is valid', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();

    expect(
      getMinInputFromFixture(fixture).getAttribute('aria-invalid'),
    ).toBeNull();
  });

  it('should remove aria-invalid from max input when range is valid', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();

    expect(
      getMaxInputFromFixture(fixture).getAttribute('aria-invalid'),
    ).toBeNull();
  });

  it('should update aria-invalid when range order becomes invalid', () => {
    const fixture = setup();

    fixture.componentInstance.rangeValue.set({ min: 10, max: 100 });
    fixture.detectChanges();

    expect(
      getMinInputFromFixture(fixture).getAttribute('aria-invalid'),
    ).toBeNull();

    fixture.componentInstance.rangeValue.set({ min: 200, max: 100 });
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('should update aria-invalid when external invalid changes', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('aria-invalid')).toBe(
      'true',
    );

    fixture.componentInstance.externalInvalid.set(false);
    fixture.detectChanges();

    expect(
      getMinInputFromFixture(fixture).getAttribute('aria-invalid'),
    ).toBeNull();
  });

  it('should reflect invalid state on the root with a data attribute', () => {
    const fixture = setup();

    fixture.componentInstance.externalInvalid.set(true);
    fixture.detectChanges();

    expect(getGroupFromFixture(fixture).getAttribute('data-invalid')).toBe('');
  });
});