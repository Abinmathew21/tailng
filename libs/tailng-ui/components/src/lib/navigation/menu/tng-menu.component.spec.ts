import { describe, expect, it } from 'vitest';
import { TngMenuComponent } from './tng-menu.component';

describe('tng-menu component', () => {
  it('exports the menu component', () => {
    expect(typeof TngMenuComponent).toBe('function');
  });
});
