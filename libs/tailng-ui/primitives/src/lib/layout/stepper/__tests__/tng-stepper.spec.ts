import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngStepper } from '../tng-stepper';

@Component({
  standalone: true,
  imports: [TngStepper],
  template: `<ol tngStepper #stepper="tngStepper" data-testid="stepper"></ol>`,
})
class StepperHostComponent {
  @ViewChild('stepper', { static: true }) stepper!: TngStepper;
}

@Component({
  standalone: true,
  imports: [TngStepper],
  template: `<section tngStepper data-testid="stepper-section"></section>`,
})
class StepperSectionHostComponent {}

describe('tng-stepper primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the stepper primitive', () => {
    expect(typeof TngStepper).toBe('function');
  });

  it('attaches data-slot="stepper" to the host element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperHostComponent],
    }).createComponent(StepperHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="stepper"]') as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.getAttribute('data-slot')).toBe('stepper');
  });

  it('supports exportAs="tngStepper"', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperHostComponent],
    }).createComponent(StepperHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.stepper).toBeInstanceOf(TngStepper);
  });

  it('works on section hosts in addition to ordered lists', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperSectionHostComponent],
    }).createComponent(StepperSectionHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="stepper-section"]') as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.getAttribute('data-slot')).toBe('stepper');
  });
});
