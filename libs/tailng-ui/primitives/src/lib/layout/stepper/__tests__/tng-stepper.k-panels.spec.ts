import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, click, getByTestId } from './tng-stepper.test-harness';

describe('TngStepper K) Panel integration', () => {
  it('tracks active panel visibility and links panels with triggers', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.detectChanges();

    const cartTrigger = getByTestId(fixture, 'trigger-cart');
    const cartPanel = getByTestId(fixture, 'panel-cart');
    const paymentPanel = getByTestId(fixture, 'panel-payment');

    expect(cartPanel.hasAttribute('hidden')).toBe(false);
    expect(paymentPanel.hasAttribute('hidden')).toBe(true);
    expect(cartPanel.getAttribute('aria-labelledby')).toBe(cartTrigger.id);
    expect(cartTrigger.getAttribute('aria-controls')).toBe(cartPanel.id);

    click(getByTestId(fixture, 'trigger-payment'));
    fixture.detectChanges();

    expect(cartPanel.hasAttribute('hidden')).toBe(true);
    expect(paymentPanel.hasAttribute('hidden')).toBe(false);
    expect(paymentPanel.getAttribute('aria-labelledby')).toBe(getByTestId(fixture, 'trigger-payment').id);
  });
});
