import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StepperHostComponent, click, getByTestId } from './tng-stepper.test-harness';

describe('TngStepper G) Uncontrolled behavior', () => {
  it('uses defaultValue, selects first enabled by default, and updates internally on activation', () => {
    const defaultFixture = TestBed.createComponent(StepperHostComponent);
    defaultFixture.componentInstance.defaultValue.set('payment');
    defaultFixture.detectChanges();
    expect(getByTestId(defaultFixture, 'trigger-payment').getAttribute('aria-current')).toBe('step');

    const firstEnabledFixture = TestBed.createComponent(StepperHostComponent);
    firstEnabledFixture.componentInstance.steps.set([
      { value: 'blocked', label: 'Blocked', disabled: true },
      { value: 'first', label: 'First enabled' },
      { value: 'second', label: 'Second enabled' },
    ]);
    firstEnabledFixture.detectChanges();
    expect(getByTestId(firstEnabledFixture, 'trigger-first').getAttribute('aria-current')).toBe('step');

    click(getByTestId(firstEnabledFixture, 'trigger-second'));
    firstEnabledFixture.detectChanges();
    expect(getByTestId(firstEnabledFixture, 'trigger-second').getAttribute('aria-current')).toBe('step');
  });
});
