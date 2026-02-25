import { describe, expect, it } from 'vitest';
import { TngPopoverComponent } from './tng-popover.component';

describe('tng-popover component', () => {
  it('exports the popover component', () => {
    expect(typeof TngPopoverComponent).toBe('function');
  });
});
