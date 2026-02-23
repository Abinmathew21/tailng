import { describe, expect, it } from 'vitest';
import { TngStepper } from './tng-stepper';

describe('tng-stepper primitive', () => {
  it('exports the stepper primitive', () => {
    expect(typeof TngStepper).toBe('function');
  });
});
