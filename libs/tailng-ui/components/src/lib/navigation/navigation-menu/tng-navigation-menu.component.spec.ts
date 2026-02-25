import { describe, expect, it } from 'vitest';
import { TngNavigationMenuComponent } from './tng-navigation-menu.component';

describe('tng-navigation-menu component', () => {
  it('exports the navigation-menu component', () => {
    expect(typeof TngNavigationMenuComponent).toBe('function');
  });
});
