import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Hosts ────────────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [min]="min"
      [max]="max"
      [step]="step"
      [minPlaceholder]="minPh"
      [maxPlaceholder]="maxPh"
    />
  `,
})
class AttrsHostComponent {
  public min: number | null = 0;
  public max: number | null = 1000;
  public step: number | string | null = 10;
  public minPh = 'Min price';
  public maxPh = 'Max price';
}

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range />`,
})
class NoAttrsHostComponent {}

function setup<T>(hostType: new () => T) {
  const fixture = TestBed.configureTestingModule({
    imports: [hostType],
  }).createComponent(hostType);
  fixture.detectChanges();
  return fixture;
}

function getMinInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.tng-number-range__input--min') as HTMLInputElement;
}

function getMaxInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.tng-number-range__input--max') as HTMLInputElement;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: Min / max attribute behavior', () => {
  it('should apply the configured min attribute to the min input', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('min')).toBe('0');
  });

  it('should apply the configured min attribute to the max input', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMaxInput(fixture.nativeElement).getAttribute('min')).toBe('0');
  });

  it('should apply the configured max attribute to the min input', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('max')).toBe('1000');
  });

  it('should apply the configured max attribute to the max input', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMaxInput(fixture.nativeElement).getAttribute('max')).toBe('1000');
  });

  it('should remove the min attribute when min input is null', () => {
    const fixture = setup(NoAttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('min')).toBeNull();
  });

  it('should remove the max attribute when max input is null', () => {
    const fixture = setup(NoAttrsHostComponent);
    expect(getMaxInput(fixture.nativeElement).getAttribute('max')).toBeNull();
  });

  it('should update the native min attribute when input min changes', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.min = 5;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('min')).toBe('5');
  });

  it('should update the native max attribute when input max changes', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.max = 500;
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('max')).toBe('500');
  });

  it('should support negative configured min', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.min = -100;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('min')).toBe('-100');
  });

  it('should support decimal configured min', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.min = 0.5;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('min')).toBe('0.5');
  });

  it('should support decimal configured max', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.max = 99.9;
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('max')).toBe('99.9');
  });
});

describe('tng-number-range: Step behavior', () => {
  it('should apply numeric step to both inputs', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('step')).toBe('10');
    expect(getMaxInput(fixture.nativeElement).getAttribute('step')).toBe('10');
  });

  it('should apply step="any" to both inputs', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.step = 'any';
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('step')).toBe('any');
    expect(getMaxInput(fixture.nativeElement).getAttribute('step')).toBe('any');
  });

  it('should remove the step attribute when no step is configured', () => {
    const fixture = setup(NoAttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('step')).toBeNull();
    expect(getMaxInput(fixture.nativeElement).getAttribute('step')).toBeNull();
  });

  it('should update step attribute when step input changes', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.step = 5;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('step')).toBe('5');
  });

  it('should support decimal step values', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.step = 0.1;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('step')).toBe('0.1');
  });
});

describe('tng-number-range: Placeholder behavior', () => {
  it('should render default min placeholder when provided', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('placeholder')).toBe('Min price');
  });

  it('should render default max placeholder when provided', () => {
    const fixture = setup(AttrsHostComponent);
    expect(getMaxInput(fixture.nativeElement).getAttribute('placeholder')).toBe('Max price');
  });

  it('should update min placeholder when input changes', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.minPh = 'From';
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).getAttribute('placeholder')).toBe('From');
  });

  it('should update max placeholder when input changes', () => {
    const fixture = setup(AttrsHostComponent);
    fixture.componentInstance.maxPh = 'To';
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).getAttribute('placeholder')).toBe('To');
  });

  it('should allow empty min placeholder', () => {
    const fixture = setup(NoAttrsHostComponent);
    expect(getMinInput(fixture.nativeElement).getAttribute('placeholder')).toBeNull();
  });

  it('should allow empty max placeholder', () => {
    const fixture = setup(NoAttrsHostComponent);
    expect(getMaxInput(fixture.nativeElement).getAttribute('placeholder')).toBeNull();
  });
});

// ── Required host ─────────────────────────────────────────────────────────────

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range [required]="required" />`,
})
class RequiredHostComponent {
  public required = false;
}

describe('tng-number-range: Required behavior', () => {
  it('should apply required to min input when required is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RequiredHostComponent],
    }).createComponent(RequiredHostComponent);
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).required).toBe(true);
  });

  it('should apply required to max input when required is true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RequiredHostComponent],
    }).createComponent(RequiredHostComponent);
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).required).toBe(true);
  });

  it('should remove required from min input when required is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RequiredHostComponent],
    }).createComponent(RequiredHostComponent);
    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).required).toBe(false);
  });

  it('should remove required from max input when required is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RequiredHostComponent],
    }).createComponent(RequiredHostComponent);
    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).required).toBe(false);
  });

  it('should update required attributes when required input changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RequiredHostComponent],
    }).createComponent(RequiredHostComponent);
    fixture.componentInstance.required = false;
    fixture.detectChanges();
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).required).toBe(true);
    expect(getMaxInput(fixture.nativeElement).required).toBe(true);
  });
});
