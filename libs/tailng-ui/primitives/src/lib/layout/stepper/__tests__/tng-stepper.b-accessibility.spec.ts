import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, getByTestId } from './tng-stepper.test-harness';

describe('TngStepper B) Accessibility', () => {
  it('exposes accessible names, current marker, disabled state, position, and state text', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.ariaLabel.set(undefined);
    fixture.componentInstance.ariaLabelledby.set('checkout-heading');
    fixture.componentInstance.defaultValue.set('shipping');
    fixture.componentInstance.steps.set([
      { value: 'cart', label: 'Cart', completed: true },
      { value: 'shipping', label: 'Shipping' },
      { value: 'payment', label: 'Payment', optional: true },
      { value: 'billing', label: 'Billing', error: true },
      { value: 'review', label: 'Review', disabled: true },
    ]);
    fixture.detectChanges();

    const root = getByTestId(fixture, 'stepper');
    const cart = getByTestId(fixture, 'trigger-cart');
    const shipping = getByTestId(fixture, 'trigger-shipping');
    const payment = getByTestId(fixture, 'trigger-payment');
    const billing = getByTestId(fixture, 'trigger-billing');
    const review = getByTestId(fixture, 'trigger-review');

    expect(root.getAttribute('aria-labelledby')).toBe('checkout-heading');
    expect(root.hasAttribute('aria-label')).toBe(false);
    expect(shipping.getAttribute('aria-current')).toBe('step');
    expect(cart.hasAttribute('aria-current')).toBe(false);
    expect(review.getAttribute('aria-disabled')).toBe('true');
    expect(payment.getAttribute('aria-label')).toContain('Step 3 of 5');
    expect(payment.getAttribute('aria-label')).toContain('Optional');
    expect(billing.getAttribute('aria-label')).toContain('Error');
    expect(cart.getAttribute('aria-label')).toContain('Completed');
  });
});
