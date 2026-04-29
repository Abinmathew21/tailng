import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, click, getByTestId, keydown } from './tng-stepper.test-harness';

describe('TngStepper E) Linear mode behavior', () => {
  it('blocks future incomplete steps and does not emit for blocked activation', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('shipping');
    fixture.componentInstance.linear.set(true);
    fixture.detectChanges();

    click(getByTestId(fixture, 'trigger-payment'));
    keydown(getByTestId(fixture, 'trigger-payment'), 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.valueChanges).toEqual([]);
    expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');
  });

  it('allows previous completed steps in linear mode and any enabled step in non-linear mode', () => {
    const linearFixture = TestBed.createComponent(StepperHostComponent);
    linearFixture.componentInstance.defaultValue.set('shipping');
    linearFixture.componentInstance.linear.set(true);
    linearFixture.detectChanges();

    click(getByTestId(linearFixture, 'trigger-cart'));
    linearFixture.detectChanges();
    expect(linearFixture.componentInstance.valueChanges).toEqual(['cart']);

    const nonLinearFixture = TestBed.createComponent(StepperHostComponent);
    nonLinearFixture.componentInstance.defaultValue.set('cart');
    nonLinearFixture.detectChanges();

    click(getByTestId(nonLinearFixture, 'trigger-payment'));
    nonLinearFixture.detectChanges();
    expect(nonLinearFixture.componentInstance.valueChanges).toEqual(['payment']);
  });
});
