import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngStepperComponent } from '../tng-stepper.component';

@Component({
  imports: [TngStepperComponent],
  template: `
    <tng-stepper [ariaLabel]="ariaLabel()" data-testid="wrapper">
      <ol data-testid="projected-list">
        <li>Draft</li>
        <li>Review</li>
      </ol>
    </tng-stepper>
  `,
})
class StepperWrapperHostComponent {
  readonly ariaLabel = signal('Release flow');
}

@Component({
  imports: [TngStepperComponent],
  template: `
    <tng-stepper data-testid="wrapper-default">
      <ol>
        <li>One</li>
      </ol>
    </tng-stepper>
  `,
})
class StepperWrapperDefaultHostComponent {}

describe('tng-stepper component', () => {
  it('exports the stepper component', () => {
    expect(typeof TngStepperComponent).toBe('function');
  });

  it('applies primitive slot + wrapper class on the rendered section', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHostComponent],
    }).createComponent(StepperWrapperHostComponent);
    fixture.detectChanges();

    const stepperSection = fixture.nativeElement.querySelector(
      '[data-testid="wrapper"] [data-slot="stepper"]',
    ) as HTMLElement | null;

    expect(stepperSection).toBeTruthy();
    expect(stepperSection?.classList.contains('tng-stepper')).toBe(true);
  });

  it('uses "Stepper" as the default aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperDefaultHostComponent],
    }).createComponent(StepperWrapperDefaultHostComponent);
    fixture.detectChanges();

    const stepperSection = fixture.nativeElement.querySelector(
      '[data-testid="wrapper-default"] [data-slot="stepper"]',
    ) as HTMLElement | null;

    expect(stepperSection).toBeTruthy();
    expect(stepperSection?.getAttribute('aria-label')).toBe('Stepper');
  });

  it('forwards ariaLabel input and updates when input signal changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHostComponent],
    }).createComponent(StepperWrapperHostComponent);
    fixture.detectChanges();

    const stepperSection = fixture.nativeElement.querySelector(
      '[data-testid="wrapper"] [data-slot="stepper"]',
    ) as HTMLElement | null;
    expect(stepperSection).toBeTruthy();
    expect(stepperSection?.getAttribute('aria-label')).toBe('Release flow');

    fixture.componentInstance.ariaLabel.set('Checkout steps');
    fixture.detectChanges();

    expect(stepperSection?.getAttribute('aria-label')).toBe('Checkout steps');
  });

  it('projects inner step markup into the wrapper', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StepperWrapperHostComponent],
    }).createComponent(StepperWrapperHostComponent);
    fixture.detectChanges();

    const projectedList = fixture.nativeElement.querySelector(
      '[data-testid="wrapper"] [data-testid="projected-list"]',
    ) as HTMLOListElement | null;

    expect(projectedList).toBeTruthy();
    expect(projectedList?.querySelectorAll('li').length).toBe(2);
    expect(projectedList?.textContent).toContain('Draft');
    expect(projectedList?.textContent).toContain('Review');
  });
});
