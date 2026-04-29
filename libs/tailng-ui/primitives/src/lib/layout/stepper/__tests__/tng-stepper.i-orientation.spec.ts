import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, getByTestId, keydown } from './tng-stepper.test-harness';

describe('TngStepper I) Orientation and RTL', () => {
  it('uses horizontal LTR/RTL and vertical Up/Down semantics', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.componentInstance.loopFocus.set(false);
    fixture.detectChanges();

    const cart = getByTestId<HTMLButtonElement>(fixture, 'trigger-cart');
    cart.focus();
    keydown(cart, 'ArrowLeft');
    expect(document.activeElement).toBe(cart);

    keydown(cart, 'ArrowRight');
    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));

    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    keydown(getByTestId(fixture, 'trigger-shipping'), 'ArrowLeft');
    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
    keydown(getByTestId(fixture, 'trigger-shipping'), 'ArrowDown');
    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-payment'));

    getByTestId(fixture, 'stepper').setAttribute('dir', 'rtl');
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();
    keydown(getByTestId(fixture, 'trigger-payment'), 'ArrowRight');
    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
  });
});
