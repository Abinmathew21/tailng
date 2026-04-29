import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, getByTestId, getTriggers } from './tng-stepper.test-harness';

describe('TngStepper A) Rendering and structure', () => {
  it('renders root and ordered triggers with orientation and state hooks', () => {
    const fixture = TestBed.createComponent(StepperHostComponent);
    fixture.componentInstance.defaultValue.set('shipping');
    fixture.detectChanges();

    const stepper = getByTestId<HTMLElement>(fixture, 'stepper');
    const triggerTestIds = getTriggers(fixture).map((trigger) => trigger.getAttribute('data-testid'));

    expect(triggerTestIds).toEqual(['trigger-cart', 'trigger-shipping', 'trigger-payment', 'trigger-review']);
    expect(stepper.getAttribute('data-slot')).toBe('stepper');
    expect(stepper.getAttribute('data-orientation')).toBe('horizontal');
    expect(stepper.hasAttribute('data-linear')).toBe(false);
    expect(getByTestId(fixture, 'trigger-shipping').getAttribute('aria-current')).toBe('step');
    expect(fixture.nativeElement.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(getByTestId(fixture, 'trigger-cart').getAttribute('data-state')).toBe('completed');
    expect(getByTestId(fixture, 'trigger-shipping').getAttribute('data-state')).toBe('current');
    expect(getByTestId(fixture, 'trigger-payment').getAttribute('data-state')).toBe('upcoming');
    expect(getByTestId(fixture, 'trigger-review').getAttribute('data-state')).toBe('disabled');
    expect(getByTestId(fixture, 'trigger-payment').hasAttribute('data-optional')).toBe(true);
    expect(getByTestId(fixture, 'item-payment').getAttribute('data-step-index')).toBe('2');
  });
});
