import { describe, expect, it } from 'vitest';
import { TngMenuTriggerFor } from './tng-menu-trigger-for.directive';

describe('tng-menu-trigger-for directive', () => {
  it('exports the trigger directive', () => {
    expect(typeof TngMenuTriggerFor).toBe('function');
  });
});
