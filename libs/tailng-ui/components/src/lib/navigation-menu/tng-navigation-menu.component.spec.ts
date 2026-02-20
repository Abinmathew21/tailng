import { describe, expect, it } from 'vitest';
import { TngNavigationMenu } from './tng-navigation-menu.component';

describe('tng-navigation-menu component', () => {
  it('exports the navigation-menu component', () => {
    expect(typeof TngNavigationMenu).toBe('function');
  });
});
