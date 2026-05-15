import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Hosts ────────────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [minPlaceholder]="minPh()"
      [maxPlaceholder]="maxPh()"
    />
  `,
})
class AttrsHostComponent {
  public min = signal<number | null>(0);
  public max = signal<number | null>(1000);
  public step = signal<number | string | null>(10);
  public minPh = signal('Min price');
  public maxPh = signal('Max price');
}

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range />`,
})
class NoAttrsHostComponent {}

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range [required]="required()" />`,
})
class RequiredHostComponent {
  public required = signal(false);
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

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: Min / max attribute behavior', () => {
  it('should apply the configured min attribute to the min input', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMinInputFromFixture(fixture).getAttribute('min')).toBe('0');
  });

  it('should apply the configured min attribute to the max input', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMaxInputFromFixture(fixture).getAttribute('min')).toBe('0');
  });

  it('should apply the configured max attribute to the min input', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMinInputFromFixture(fixture).getAttribute('max')).toBe('1000');
  });

  it('should apply the configured max attribute to the max input', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMaxInputFromFixture(fixture).getAttribute('max')).toBe('1000');
  });

  it('should remove the min attribute when min input is null', () => {
    const fixture = setup(NoAttrsHostComponent);

    expect(getMinInputFromFixture(fixture).getAttribute('min')).toBeNull();
  });

  it('should remove the max attribute when max input is null', () => {
    const fixture = setup(NoAttrsHostComponent);

    expect(getMaxInputFromFixture(fixture).getAttribute('max')).toBeNull();
  });

  it('should update the native min attribute when input min changes', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.min.set(5);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('min')).toBe('5');
  });

  it('should update the native max attribute when input max changes', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.max.set(500);
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).getAttribute('max')).toBe('500');
  });

  it('should support negative configured min', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.min.set(-100);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('min')).toBe('-100');
  });

  it('should support decimal configured min', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.min.set(0.5);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('min')).toBe('0.5');
  });

  it('should support decimal configured max', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.max.set(99.9);
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).getAttribute('max')).toBe('99.9');
  });
});

describe('tng-number-range: Step behavior', () => {
  it('should apply numeric step to both inputs', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMinInputFromFixture(fixture).getAttribute('step')).toBe('10');
    expect(getMaxInputFromFixture(fixture).getAttribute('step')).toBe('10');
  });

  it('should apply step="any" to both inputs', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.step.set('any');
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('step')).toBe('any');
    expect(getMaxInputFromFixture(fixture).getAttribute('step')).toBe('any');
  });

  it('should remove the step attribute when no step is configured', () => {
    const fixture = setup(NoAttrsHostComponent);

    expect(getMinInputFromFixture(fixture).getAttribute('step')).toBeNull();
    expect(getMaxInputFromFixture(fixture).getAttribute('step')).toBeNull();
  });

  it('should update step attribute when step input changes', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.step.set(5);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('step')).toBe('5');
  });

  it('should support decimal step values', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.step.set(0.1);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('step')).toBe('0.1');
  });
});

describe('tng-number-range: Placeholder behavior', () => {
  it('should render default min placeholder when provided', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMinInputFromFixture(fixture).getAttribute('placeholder')).toBe(
      'Min price',
    );
  });

  it('should render default max placeholder when provided', () => {
    const fixture = setup(AttrsHostComponent);

    expect(getMaxInputFromFixture(fixture).getAttribute('placeholder')).toBe(
      'Max price',
    );
  });

  it('should update min placeholder when input changes', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.minPh.set('From');
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).getAttribute('placeholder')).toBe(
      'From',
    );
  });

  it('should update max placeholder when input changes', () => {
    const fixture = setup(AttrsHostComponent);

    fixture.componentInstance.maxPh.set('To');
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).getAttribute('placeholder')).toBe(
      'To',
    );
  });

  it('should allow empty min placeholder', () => {
    const fixture = setup(NoAttrsHostComponent);

    expect(
      getMinInputFromFixture(fixture).getAttribute('placeholder'),
    ).toBeNull();
  });

  it('should allow empty max placeholder', () => {
    const fixture = setup(NoAttrsHostComponent);

    expect(
      getMaxInputFromFixture(fixture).getAttribute('placeholder'),
    ).toBeNull();
  });
});

describe('tng-number-range: Required behavior', () => {
  it('should apply required to min input when required is true', () => {
    const fixture = setup(RequiredHostComponent);

    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).required).toBe(true);
  });

  it('should apply required to max input when required is true', () => {
    const fixture = setup(RequiredHostComponent);

    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).required).toBe(true);
  });

  it('should remove required from min input when required is false', () => {
    const fixture = setup(RequiredHostComponent);

    fixture.componentInstance.required.set(false);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).required).toBe(false);
  });

  it('should remove required from max input when required is false', () => {
    const fixture = setup(RequiredHostComponent);

    fixture.componentInstance.required.set(false);
    fixture.detectChanges();

    expect(getMaxInputFromFixture(fixture).required).toBe(false);
  });

  it('should update required attributes when required input changes', () => {
    const fixture = setup(RequiredHostComponent);

    fixture.componentInstance.required.set(false);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).required).toBe(false);
    expect(getMaxInputFromFixture(fixture).required).toBe(false);

    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    expect(getMinInputFromFixture(fixture).required).toBe(true);
    expect(getMaxInputFromFixture(fixture).required).toBe(true);
  });
});