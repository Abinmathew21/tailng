import { describe, expect, it } from 'vitest';
import { TngPopover } from './tng-popover.component';

describe('tng-popover component', () => {
  it('exports the popover component', () => {
    expect(typeof TngPopover).toBe('function');
  });
});
