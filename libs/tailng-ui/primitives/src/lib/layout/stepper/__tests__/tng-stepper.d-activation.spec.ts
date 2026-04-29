import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, click, getByTestId, keydown } from './tng-stepper.test-harness';

describe('TngStepper D) Activation behavior', () => {
  it('activates allowed steps with click, Enter, and Space', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.detectChanges();

    click(getByTestId(fixture, 'trigger-shipping'));
    keydown(getByTestId(fixture, 'trigger-payment'), 'Enter');
    keydown(getByTestId(fixture, 'trigger-cart'), ' ');
    fixture.detectChanges();

    expect(fixture.componentInstance.valueChanges).toEqual(['shipping', 'payment', 'cart']);
    expect(fixture.componentInstance.stepChanges.map((event) => (event as { trigger: string }).trigger)).toEqual([
      'pointer',
      'keyboard',
      'keyboard',
    ]);
  });

  it('does not activate disabled steps with click or keyboard', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('cart');
    fixture.detectChanges();

    click(getByTestId(fixture, 'trigger-review'));
    keydown(getByTestId(fixture, 'trigger-review'), 'Enter');
    keydown(getByTestId(fixture, 'trigger-review'), ' ');
    fixture.detectChanges();

    expect(fixture.componentInstance.valueChanges).toEqual([]);
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');
  });
});
