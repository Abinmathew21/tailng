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
      [ariaLabel]="ariaLabel"
      [ariaLabelledby]="ariaLabelledby"
      [minAriaLabel]="minAriaLabel"
      [maxAriaLabel]="maxAriaLabel"
      [value]="rangeValue"
      [invalid]="externalInvalid"
    />
  `,
})
class A11yHostComponent {
  public ariaLabel: string | null = 'Price range';
  public ariaLabelledby: string | null = null;
  public minAriaLabel = 'Minimum price';
  public maxAriaLabel = 'Maximum price';
  public rangeValue: TngNumberRangeValue = { min: null, max: null };
  public externalInvalid = false;
}

function setup() {
  const fixture = TestBed.configureTestingModule({
    imports: [A11yHostComponent],
  }).createComponent(A11yHostComponent);
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

function getSeparator(el: HTMLElement): HTMLElement {
  return el.querySelector('.tng-number-range__separator') as HTMLElement;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: Accessibility - group semantics', () => {
  it('should set role="group" on the root/group element', () => {
    const fixture = setup();
    expect(getGroup(fixture.nativeElement).getAttribute('role')).toBe('group');
  });

  it('should apply aria-label to the group when ariaLabel is provided', () => {
    const fixture = setup();
    expect(getGroup(fixture.nativeElement).getAttribute('aria-label')).toBe('Price range');
  });

  it('should apply aria-labelledby to the group when ariaLabelledby is provided', () => {
    const fixture = setup();
    fixture.componentInstance.ariaLabel = null;
    fixture.componentInstance.ariaLabelledby = 'range-label-id';
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).getAttribute('aria-labelledby')).toBe('range-label-id');
  });

  it('should not set empty aria-label', () => {
    const fixture = setup();
    fixture.componentInstance.ariaLabel = '';
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).getAttribute('aria-label')).toBeNull();
  });

  it('should not set empty aria-labelledby', () => {
    const fixture = setup();
    fixture.componentInstance.ariaLabelledby = '';
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).getAttribute('aria-labelledby')).toBeNull();
  });

  it('should keep the separator aria-hidden="true"', () => {
    const fixture = setup();
    expect(getSeparator(fixture.nativeElement).getAttribute('aria-hidden')).toBe('true');
  });

  it('should not expose separator text as an accessible name', () => {
    const fixture = setup();
    const sep = getSeparator(fixture.nativeElement);
    expect(sep.getAttribute('aria-hidden')).toBe('true');
    expect(sep.getAttribute('role')).toBeNull();
  });

  it('should keep group semantics stable after value changes', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).getAttribute('role')).toBe('group');
    expect(getGroup(fixture.nativeElement).getAttribute('aria-label')).toBe('Price range');
  });
});

describe('tng-number-range: Accessibility - input labels', () => {
  it('should apply min input accessible label from minAriaLabel', () => {
    const fixture = setup();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-label')).toBe('Minimum price');
  });

  it('should apply max input accessible label from maxAriaLabel', () => {
    const fixture = setup();
    expect(getMaxInput(fixture.nativeElement).getAttribute('aria-label')).toBe('Maximum price');
  });

  it('should provide sensible default min input aria label if none is provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngNumberRangeComponent],
    }).createComponent(TngNumberRangeComponent);
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-label')).toBeTruthy();
  });

  it('should provide sensible default max input aria label if none is provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngNumberRangeComponent],
    }).createComponent(TngNumberRangeComponent);
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('aria-label')).toBeTruthy();
  });

  it('should update min input aria label when input changes', () => {
    const fixture = setup();
    fixture.componentInstance.minAriaLabel = 'From';
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-label')).toBe('From');
  });

  it('should update max input aria label when input changes', () => {
    const fixture = setup();
    fixture.componentInstance.maxAriaLabel = 'To';
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('aria-label')).toBe('To');
  });

  it('should keep min and max input names distinct', () => {
    const fixture = setup();
    const minLabel = getMinInput(fixture.nativeElement).getAttribute('aria-label');
    const maxLabel = getMaxInput(fixture.nativeElement).getAttribute('aria-label');
    expect(minLabel).not.toBe(maxLabel);
  });
});

describe('tng-number-range: Accessibility - invalid state', () => {
  it('should set aria-invalid="true" on min input when range is invalid', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-invalid="true" on max input when range is invalid', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 100, max: 10 };
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('aria-invalid')).toBe('true');
  });

  it('should remove aria-invalid from min input when range is valid', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBeNull();
  });

  it('should remove aria-invalid from max input when range is valid', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('aria-invalid')).toBeNull();
  });

  it('should update aria-invalid when range order becomes invalid', () => {
    const fixture = setup();
    fixture.componentInstance.rangeValue = { min: 10, max: 100 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBeNull();

    fixture.componentInstance.rangeValue = { min: 200, max: 100 };
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBe('true');
  });

  it('should update aria-invalid when external invalid changes', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.externalInvalid = false;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('aria-invalid')).toBeNull();
  });

  it('should reflect invalid state on the root with a data attribute', () => {
    const fixture = setup();
    fixture.componentInstance.externalInvalid = true;
    fixture.detectChanges();
    expect(getGroup(fixture.nativeElement).getAttribute('data-invalid')).toBe('');
  });
});
