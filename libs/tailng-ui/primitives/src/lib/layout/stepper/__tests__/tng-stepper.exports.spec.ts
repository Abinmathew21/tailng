import { describe, expect, it } from 'vitest';

import * as primitives from '../../../../index';
import { TngStepper, TngStepperItem, TngStepperPanel, TngStepperTrigger } from '../tng-stepper';

describe('TngStepper exports', () => {
  it('exports the public stepper primitives', () => {
    expect(primitives.TngStepper).toBe(TngStepper);
    expect(primitives.TngStepperItem).toBe(TngStepperItem);
    expect(primitives.TngStepperTrigger).toBe(TngStepperTrigger);
    expect(primitives.TngStepperPanel).toBe(TngStepperPanel);
  });
});
