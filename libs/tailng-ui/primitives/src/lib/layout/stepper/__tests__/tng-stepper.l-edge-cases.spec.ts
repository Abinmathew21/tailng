import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, getByTestId, getCurrentTrigger, keydown } from './tng-stepper.test-harness';

describe('TngStepper L) Edge cases', () => {
  it('handles zero and single step scenarios without throwing', () => {
    const zeroFixture = TestBed.createComponent(StepperHostComponent);
    zeroFixture.componentInstance.steps.set([]);
    expect(() => zeroFixture.detectChanges()).not.toThrow();
    expect(getCurrentTrigger(zeroFixture)).toBeNull();

    const singleFixture = TestBed.createComponent(StepperHostComponent);
    singleFixture.componentInstance.steps.set([{ value: 'only', label: 'Only' }]);
    singleFixture.detectChanges();

    const only = getByTestId<HTMLButtonElement>(singleFixture, 'trigger-only');
    expect(only.getAttribute('aria-current')).toBe('step');
    expect(only.getAttribute('tabindex')).toBe('0');
    only.focus();
    keydown(only, 'ArrowRight');
    expect(document.activeElement).toBe(only);
  });

  it('falls back for invalid controlled values and tolerates rapid updates', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.value.set('missing');
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');

    expect(() => {
      fixture.componentInstance.value.set('payment');
      fixture.componentInstance.orientation.set('vertical');
      fixture.componentInstance.linear.set(true);
      fixture.componentInstance.steps.update((steps) =>
        steps.map((step) => (step.value === 'payment' ? { ...step, error: true } : step)),
      );
      fixture.detectChanges();
      fixture.componentInstance.value.set('shipping');
      fixture.componentInstance.orientation.set('horizontal');
      fixture.componentInstance.linear.set(false);
      fixture.detectChanges();
    }).not.toThrow();

    expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');
  });

  it('exposes programmatic select and focus helpers through exportAs', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.detectChanges();

    fixture.componentInstance.stepperRef.select('payment');
    fixture.detectChanges();
    expect(getByTestId(fixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');

    fixture.componentInstance.stepperRef.focus('shipping');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
  });
});
