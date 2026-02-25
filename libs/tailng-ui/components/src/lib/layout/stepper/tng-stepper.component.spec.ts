import { describe, expect, it } from 'vitest';
import { TngStepperComponent } from './tng-stepper.component';

describe('tng-stepper component', () => {
  it('exports the stepper component', () => {
    expect(typeof TngStepperComponent).toBe('function');
  });
});
