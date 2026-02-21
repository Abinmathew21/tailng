import { describe, expect, it } from 'vitest';
import { TngDropdownMenu } from './tng-dropdown-menu.component';

describe('tng-dropdown-menu component', () => {
  it('exports the dropdown-menu component', () => {
    expect(typeof TngDropdownMenu).toBe('function');
  });
});
