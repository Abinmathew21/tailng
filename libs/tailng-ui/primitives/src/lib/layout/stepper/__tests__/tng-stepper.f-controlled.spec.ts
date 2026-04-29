import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, click, getByTestId } from './tng-stepper.test-harness';

describe('TngStepper F) Controlled behavior', () => {
  it('drives current step from value and emits without visually changing until host updates', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.value.set('cart');
    fixture.detectChanges();

    click(getByTestId(fixture, 'trigger-payment'));
    fixture.detectChanges();

    expect(fixture.componentInstance.valueChanges).toEqual(['payment']);
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('aria-current')).toBe('step');

    fixture.componentInstance.value.set('payment');
    fixture.detectChanges();
    expect(getByTestId(fixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');
  });
});
