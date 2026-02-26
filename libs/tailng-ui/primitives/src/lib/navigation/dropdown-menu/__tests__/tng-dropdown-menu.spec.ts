import { describe, expect, it } from 'vitest';
import { TngDropdownMenu } from '../tng-dropdown-menu';

describe('tng-dropdown-menu primitive', () => {
  it('exports the dropdown-menu primitive', () => {
    expect(typeof TngDropdownMenu).toBe('function');
  });
});
