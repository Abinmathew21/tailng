import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, getByTestId } from './tng-stepper.test-harness';

describe('TngStepper J) Data attributes', () => {
  it('updates orientation, linear, state, optional, and index attributes reactively', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.detectChanges();

    fixture.componentInstance.orientation.set('vertical');
    fixture.componentInstance.linear.set(true);
    fixture.componentInstance.steps.set([
      { value: 'shipping', label: 'Shipping' },
      { value: 'cart', label: 'Cart', completed: true },
      { value: 'payment', label: 'Payment', optional: true },
    ]);
    fixture.detectChanges();

    expect(getByTestId(fixture, 'stepper').getAttribute('data-orientation')).toBe('vertical');
    expect(getByTestId(fixture, 'stepper').hasAttribute('data-linear')).toBe(true);
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('data-state')).toBe('current');
    expect(getByTestId(fixture, 'trigger-payment').hasAttribute('data-optional')).toBe(true);
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('data-step-index')).toBe('1');
  });
});
