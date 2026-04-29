import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { StepperHostComponent, getByTestId } from './tng-stepper.test-harness';

describe('TngStepper H) Dynamic children', () => {
  it('falls back to nearest enabled step when current step is removed or disabled', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('payment');
    fixture.detectChanges();

    fixture.componentInstance.steps.update((steps) => steps.filter((step) => step.value !== 'payment'));
    fixture.detectChanges();
    expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');

    fixture.componentInstance.steps.update((steps) =>
      steps.map((step) => (step.value === 'shipping' ? { ...step, disabled: true } : step)),
    );
    fixture.detectChanges();
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');
  });

  it('preserves selection by value on reorder and warns for duplicate values', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('payment');
    fixture.detectChanges();

    fixture.componentInstance.steps.set([
      { value: 'payment', label: 'Payment', optional: true },
      { value: 'cart', label: 'Cart', completed: true },
      { value: 'shipping', label: 'Shipping' },
      { value: 'review', label: 'Review', disabled: true },
    ]);
    fixture.detectChanges();

    expect(getByTestId(fixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');
    expect(getByTestId(fixture, 'trigger-payment').getAttribute('data-step-index')).toBe('0');

    fixture.componentInstance.value.set('payment');
    fixture.componentInstance.steps.set([
      { value: 'cart', label: 'Cart', trackBy: 'cart' },
      { value: 'payment', label: 'Payment', completed: true, error: true, trackBy: 'payment-a' },
      { value: 'payment', label: 'Duplicate payment', trackBy: 'payment-b' },
    ]);
    fixture.detectChanges();

    expect(getByTestId(fixture, 'trigger-payment').getAttribute('data-state')).toBe('error');
    expect(warn).toHaveBeenCalledWith('TngStepper: duplicate step value "payment" registered.');
    warn.mockRestore();
  });
});
