import { describe, expect, it } from 'vitest';
import { TngStepper } from './tng-stepper.component';

describe('tng-stepper component', () => {
  it('exports the stepper component', () => {
    expect(typeof TngStepper).toBe('function');
  });
});
