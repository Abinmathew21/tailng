import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, getByTestId, getTriggers, keydown } from './tng-stepper.test-harness';

describe('TngStepper C) Focus and roving tabindex', () => {
  it('keeps one trigger tabbable and lets Tab leave the trigger row naturally', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('shipping');
    fixture.detectChanges();

    expect(getTriggers(fixture).map((trigger) => trigger.getAttribute('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
      '-1',
    ]);

    const tabEvent = keydown(getByTestId(fixture, 'trigger-shipping'), 'Tab');
    const shiftTabEvent = keydown(getByTestId(fixture, 'trigger-shipping'), 'Tab', { shiftKey: true });
    expect(tabEvent.defaultPrevented).toBe(false);
    expect(shiftTabEvent.defaultPrevented).toBe(false);
  });

  it('moves focus with arrows, Home, End, RTL, and skips disabled triggers', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.detectChanges();

    const cart = getByTestId<HTMLButtonElement>(fixture, 'trigger-cart');
    const payment = getByTestId<HTMLButtonElement>(fixture, 'trigger-payment');
    cart.focus();
    keydown(cart, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));
    expect(getByTestId(fixture, 'trigger-shipping').getAttribute('tabindex')).toBe('0');

    keydown(getByTestId(fixture, 'trigger-shipping'), 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(payment);

    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    keydown(payment, 'ArrowUp');
    fixture.detectChanges();
    expect(document.activeElement).toBe(getByTestId(fixture, 'trigger-shipping'));

    getByTestId(fixture, 'stepper').setAttribute('dir', 'rtl');
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();
    keydown(getByTestId(fixture, 'trigger-shipping'), 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(cart);
  });
});
