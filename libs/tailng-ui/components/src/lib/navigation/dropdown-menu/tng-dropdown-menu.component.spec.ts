import { describe, expect, it } from 'vitest';
import { TngDropdownMenuComponent } from './tng-dropdown-menu.component';

describe('tng-dropdown-menu component', () => {
  it('exports the dropdown-menu component', () => {
    expect(typeof TngDropdownMenuComponent).toBe('function');
  });
});
